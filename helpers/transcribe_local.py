"""Word timings with local faster-whisper, written in the same JSON shape as helpers/transcribe.py (Scribe).

Use when the ElevenLabs quota is out, or for any voiceover we generated ourselves (we already know the
words; we only need when each is said).

With --lines (the vo_lines/ folder helpers/voice_cast.py writes, with its lines.json), each line is
transcribed on its own and shifted by its exact start in the joined voiceover. That keeps errors
inside one line instead of letting them drift across the reel.

Usage:
    python helpers/transcribe_local.py reels/<dir>/voiceover.wav --edit-dir reels/<dir>/edit --language hi
    python helpers/transcribe_local.py reels/<dir>/voiceover.wav --edit-dir reels/<dir>/edit --lines reels/<dir>/vo_lines
Writes <edit-dir>/transcripts/<stem>.json = {"words": [{text, start, end, type: "word"}]}.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def decode(path: Path):
    """16 kHz mono float32 via ffmpeg (faster-whisper's PyAV decoder breaks on some PyAV versions)."""
    import numpy as np

    pcm = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(pcm, np.int16).astype(np.float32) / 32768.0


def words_of(model, audio, language: str, offset: float = 0.0) -> list[dict]:
    segments, _ = model.transcribe(audio, language=language, word_timestamps=True, vad_filter=False)
    return [
        {"text": w.word.strip(), "start": round(w.start + offset, 3), "end": round(w.end + offset, 3), "type": "word"}
        for seg in segments
        for w in (seg.words or [])
        if w.word.strip()
    ]


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("audio", type=Path)
    p.add_argument("--edit-dir", type=Path, required=True)
    p.add_argument("--language", default="hi")
    p.add_argument("--model", default="small")
    p.add_argument("--lines", type=Path, help="vo_lines/ folder with lines.json from voice_cast.py")
    args = p.parse_args()

    from faster_whisper import WhisperModel

    model = WhisperModel(args.model, device="cpu", compute_type="int8")
    if args.lines:
        words = []
        for line in json.loads((args.lines / "lines.json").read_text(encoding="utf-8")):
            words += words_of(model, decode(args.lines / line["file"]), args.language, line["start"])
    else:
        words = words_of(model, decode(args.audio), args.language)

    out = args.edit_dir / "transcripts" / f"{args.audio.stem}.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({"words": words, "source": f"faster-whisper {args.model}"}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"    words: {len(words)} -> {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
