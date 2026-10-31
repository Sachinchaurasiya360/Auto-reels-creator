"""Finish a rendered series reel: loudness to -14 LUFS / -1 dBTP, black-frame scan, loudness check,
cover still, and copy into the reel folder as final.mp4 + cover.png.

Usage:
    python helpers/finish_reel.py series/studio/out/<slug>.mp4 reels/<date>-<slug> --cover-at 12.6
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path


def ff(*args: str) -> subprocess.CompletedProcess:
    return subprocess.run(["ffmpeg", "-hide_banner", "-nostats", *args], capture_output=True, text=True, encoding="utf-8", errors="replace")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("render", type=Path)
    p.add_argument("reel_dir", type=Path)
    p.add_argument("--cover-at", type=float, default=1.0, help="seconds: the strongest frame")
    args = p.parse_args()

    final = args.reel_dir / "final.mp4"
    # Two-pass loudnorm: measure, then apply the measured values (single pass under-shoots on short speech).
    probe = ff("-i", str(args.render), "-af", "loudnorm=I=-14:TP=-1.0:LRA=11:print_format=json", "-f", "null", "-")
    m = json.loads(re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", probe.stderr, re.S).group(0))
    af = (f"loudnorm=I=-14:TP=-1.0:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    out = ff("-y", "-i", str(args.render), "-c:v", "copy", "-af", af, "-ar", "48000", "-c:a", "aac", "-b:a", "192k",
             "-movflags", "+faststart", str(final))
    if out.returncode:
        sys.exit(out.stderr[-2000:])

    black = ff("-i", str(final), "-vf", "blackdetect=d=0.1:pix_th=0.10", "-an", "-f", "null", "-")
    blacks = re.findall(r"black_start:([\d.]+) black_end:([\d.]+)", black.stderr)
    loud = ff("-i", str(final), "-af", "ebur128=peak=true", "-f", "null", "-")
    i_lufs = re.findall(r"I:\s+(-?[\d.]+) LUFS", loud.stderr)[-1]
    peak = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", loud.stderr)[-1]
    dur = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(final)],
                         capture_output=True, text=True).stdout.strip()
    ff("-y", "-ss", str(args.cover_at), "-i", str(final), "-frames:v", "1", str(args.reel_dir / "cover.png"))

    print(f"final: {final}  {float(dur):.1f}s  {i_lufs} LUFS  true peak {peak} dBFS")
    print(f"black frames: {blacks if blacks else 'none'}")
    print(f"cover: {args.reel_dir / 'cover.png'} (t={args.cover_at}s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
