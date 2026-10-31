"""Voice a series script with one Sarvam voice per speaker, then join the lines into one voiceover.

Reads script_tts.txt (Devanagari, `I:` / `C:` / `N:` speaker prefixes; no prefix = narrator), voices
each line with helpers/sarvam/tts.mjs, and concatenates with a short pause inside a speaker's turn
and a longer one when the speaker changes. Lines already voiced are reused, so a fix to one line
re-voices only that line (delete its file, or pass --force to redo all).

Cast (confirmed 2026-10-31): narrator mohit_hi_conversational, interviewer aditya_hi_conversational,
candidate advait_hi_character.

Usage:
    python helpers/voice_cast.py reels/<dir>/script_tts.txt -o reels/<dir>/voiceover.wav [--pace 1.1] [--force]
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
CAST = {"N": "mohit_hi_conversational", "I": "aditya_hi_conversational", "C": "advait_hi_character"}
SAME_SPEAKER_GAP = 0.22
SPEAKER_CHANGE_GAP = 0.42
RATE = 48000


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("script", type=Path)
    p.add_argument("-o", "--output", type=Path, required=True)
    p.add_argument("--pace", default="1.1")
    p.add_argument("--force", action="store_true")
    args = p.parse_args()
    sys.stdout.reconfigure(encoding="utf-8")  # Devanagari progress lines on a Windows console

    lines =[l.strip() for l in args.script.read_text(encoding="utf-8").splitlines() if l.strip() and not l.startswith("#")]
    parts_dir = args.output.parent / "vo_lines"
    parts_dir.mkdir(parents=True, exist_ok=True)

    parts: list[tuple[str, Path]] = []
    for i, line in enumerate(lines, 1):
        m = re.match(r"([ICN]):\s*(.*)", line)
        who, text = (m.group(1), m.group(2)) if m else ("N", line)
        out = parts_dir / f"{i:02d}_{who}.wav"
        if args.force or not out.exists():
            cmd = ["node", str(REPO / "helpers/sarvam/tts.mjs"), "--text", text, "-o", str(out),
                   "--speaker", CAST[who], "--lang", "hi-IN", "--pace", args.pace, "--force"]
            print(f"{i:02d} {who} {CAST[who]}: {text[:60]}")
            subprocess.run(cmd, check=True)
        parts.append((who, out))

    # Concatenate with gaps: silence inputs between parts, all at one rate, mono.
    inputs, graph, labels = [], "", []
    for k, (who, f) in enumerate(parts):
        inputs += ["-i", str(f)]
        graph += f"[{k}:a]aresample={RATE},aformat=channel_layouts=mono[a{k}];"
        labels.append(f"[a{k}]")
        if k + 1 < len(parts):
            gap = SPEAKER_CHANGE_GAP if parts[k + 1][0] != who else SAME_SPEAKER_GAP
            graph += f"aevalsrc=0:d={gap}:s={RATE}[g{k}];"
            labels.append(f"[g{k}]")
    graph += f"{''.join(labels)}concat=n={len(labels)}:v=0:a=1[out]"
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", *inputs, "-filter_complex", graph,
                    "-map", "[out]", "-ar", str(RATE), "-ac", "1", "-c:a", "pcm_s16le", str(args.output)], check=True)
    probe = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(f)],
                                           capture_output=True, text=True).stdout.strip())
    # Where each line starts in the joined file: exact anchors for captions (helpers/transcribe_local.py --lines).
    t, manifest = 0.0, []
    for k, (who, f) in enumerate(parts):
        if k:
            t += SPEAKER_CHANGE_GAP if who != parts[k - 1][0] else SAME_SPEAKER_GAP
        manifest.append({"file": f.name, "speaker": who, "start": round(t, 3)})
        t += probe(f)
    (parts_dir / "lines.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8")
    print(f"voiceover: {args.output} ({probe(args.output):.1f}s, {len(parts)} lines)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
