"""Generate a voiceover in the user's cloned voice with Chatterbox (local, free).

Reads a script (one sentence or short phrase per line; blank lines become a
longer pause), clones the voice from a 10-30s reference recording, renders
each line separately so a bad line can be regenerated alone, then joins the
lines and loudness-normalizes to -14 LUFS (Reels / Shorts target).

Runs in its own venv because Chatterbox pins torch:
    .venv-tts/Scripts/python.exe helpers/voiceover.py ...

Usage:
    # once: clean the user's sample into the reference clip
    python helpers/voiceover.py --prep-ref "voice/sample.m4a"

    # every video
    python helpers/voiceover.py <edit_dir>/script.txt -o <edit_dir>/voiceover.wav
    python helpers/voiceover.py script.txt -o vo.wav --only 3,7   # redo lines 3 and 7
    python helpers/voiceover.py script.txt -o vo.wav --model standard --exaggeration 0.6
    python helpers/voiceover.py script_hi.txt -o vo.wav --language hi   # multilingual model

Outputs:
    <out>                     joined, normalized voiceover
    <out_stem>_lines/NN.wav   one file per script line (cached; reused unless --only/--force)
    <out_stem>_lines.json     per-line start/end times in the joined file
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
import wave
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DEFAULT_REF = REPO / "voice" / "reference.wav"
LINE_GAP_S = 0.18
PARAGRAPH_GAP_S = 0.45


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, capture_output=True)


def prep_reference(sample: Path, out: Path) -> None:
    """Mono 24kHz, high-passed, silence-trimmed, first 25s, normalized."""
    out.parent.mkdir(parents=True, exist_ok=True)
    af = (
        "highpass=f=80,"
        "silenceremove=start_periods=1:start_threshold=-45dB:"
        "stop_periods=-1:stop_duration=0.6:stop_threshold=-45dB,"
        "loudnorm=I=-16:TP=-1.5:LRA=11"
    )
    run(["ffmpeg", "-y", "-i", str(sample), "-af", af, "-t", "25",
         "-ac", "1", "-ar", "24000", str(out)])
    with wave.open(str(out)) as w:
        dur = w.getnframes() / w.getframerate()
    print(f"reference: {out} ({dur:.1f}s)")
    if dur < 8:
        print("warning: under 8s of speech; clone quality will suffer. Record 15-30s.")


def parse_script(path: Path) -> list[tuple[str, bool]]:
    """Return (line, paragraph_break_after) pairs."""
    lines: list[tuple[str, bool]] = []
    for raw in path.read_text(encoding="utf-8").splitlines():
        text = raw.strip()
        if not text:
            if lines:
                lines[-1] = (lines[-1][0], True)
            continue
        if text.startswith("#"):
            continue
        lines.append((text, False))
    return lines


def load_model(kind: str, device: str):
    if kind == "multilingual":
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        return ChatterboxMultilingualTTS.from_pretrained(device=device)
    if kind == "turbo":
        from chatterbox.tts_turbo import ChatterboxTurboTTS
        return ChatterboxTurboTTS.from_pretrained(device=device)
    from chatterbox.tts import ChatterboxTTS
    return ChatterboxTTS.from_pretrained(device=device)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("script", type=Path, nargs="?", help="Script file, one line per utterance")
    ap.add_argument("-o", "--output", type=Path, help="Output wav")
    ap.add_argument("--ref", type=Path, default=DEFAULT_REF, help=f"Reference voice clip (default {DEFAULT_REF})")
    ap.add_argument("--prep-ref", type=Path, metavar="SAMPLE", help="Clean a raw recording into --ref and exit")
    ap.add_argument("--model", choices=["turbo", "standard", "multilingual"], default="turbo")
    ap.add_argument("--language", default="en", help="Language code; anything but en switches to the multilingual model")
    ap.add_argument("--exaggeration", type=float, default=0.5, help="standard/multilingual only: emotion intensity")
    ap.add_argument("--cfg-weight", type=float, default=0.5, help="standard/multilingual only: lower = slower, more deliberate")
    ap.add_argument("--only", help="Comma-separated 1-based line numbers to regenerate")
    ap.add_argument("--force", action="store_true", help="Regenerate every line")
    ap.add_argument("--device", default=None, help="cuda / cpu (default: auto)")
    args = ap.parse_args()

    if args.prep_ref:
        prep_reference(args.prep_ref, args.ref)
        return
    if not args.script or not args.output:
        ap.error("script and -o are required (or use --prep-ref)")
    if args.language != "en":
        args.model = "multilingual"
    if not args.ref.exists():
        sys.exit(f"no reference voice at {args.ref}; run --prep-ref <your_sample> first")

    lines = parse_script(args.script)
    if not lines:
        sys.exit("script is empty")

    out = args.output
    line_dir = out.with_name(out.stem + "_lines")
    line_dir.mkdir(parents=True, exist_ok=True)
    only = {int(n) for n in args.only.split(",")} if args.only else None
    todo = [
        i for i in range(1, len(lines) + 1)
        if args.force or (only and i in only) or not (line_dir / f"{i:02d}.wav").exists()
    ]

    if todo:
        import torch
        import torchaudio as ta

        device = args.device or ("cuda" if torch.cuda.is_available() else "cpu")
        print(f"loading chatterbox-{args.model} on {device}")
        model = load_model(args.model, device)
        for i in todo:
            text = lines[i - 1][0]
            kw = {"audio_prompt_path": str(args.ref)}
            if args.model in ("standard", "multilingual"):
                kw.update(exaggeration=args.exaggeration, cfg_weight=args.cfg_weight)
            if args.model == "multilingual":
                kw["language_id"] = args.language
            wav = model.generate(text, **kw)
            ta.save(str(line_dir / f"{i:02d}.wav"), wav, model.sr)
            print(f"  [{i:02d}] {text}")

    # Join: trim each line's edge silence, insert fixed gaps, normalize.
    concat_list = line_dir / "concat.txt"
    timings = []
    t = 0.0
    entries = []
    for i, (text, para) in enumerate(lines, start=1):
        trimmed = line_dir / f"{i:02d}.trim.wav"
        run(["ffmpeg", "-y", "-i", str(line_dir / f"{i:02d}.wav"), "-af",
             "silenceremove=start_periods=1:start_threshold=-50dB,"
             "areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse",
             "-ac", "1", "-ar", "48000", str(trimmed)])
        with wave.open(str(trimmed)) as w:
            dur = w.getnframes() / w.getframerate()
        timings.append({"line": i, "text": text, "start": round(t, 3), "end": round(t + dur, 3)})
        entries.append(trimmed)
        t += dur
        if i < len(lines):
            gap = PARAGRAPH_GAP_S if para else LINE_GAP_S
            gap_file = line_dir / f"gap_{int(gap * 1000)}.wav"
            if not gap_file.exists():
                run(["ffmpeg", "-y", "-f", "lavfi", "-i", "anullsrc=r=48000:cl=mono",
                     "-t", f"{gap}", str(gap_file)])
            entries.append(gap_file)
            t += gap
    concat_list.write_text("".join(f"file '{p.resolve().as_posix()}'\n" for p in entries), encoding="utf-8")

    joined = line_dir / "joined.wav"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_list), "-c", "copy", str(joined)])
    run(["ffmpeg", "-y", "-i", str(joined), "-af", "loudnorm=I=-14:TP=-1.0:LRA=9",
         "-ar", "48000", "-ac", "1", str(out)])
    out.with_name(out.stem + "_lines.json").write_text(json.dumps(timings, indent=2), encoding="utf-8")
    print(f"voiceover: {out} ({t:.1f}s, {len(lines)} lines)")


if __name__ == "__main__":
    main()
