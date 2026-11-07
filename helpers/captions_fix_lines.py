"""Repair caption lines whose word times collapsed (ASR lost the line, so many words share one start).

    python helpers/captions_fix_lines.py <captions.json> <vo_lines/lines.json> <voiceover.wav>

lines.json (from voice_cast.py) gives each script line's start in the voiceover. A line is re-timed when 3+ of its
words share a start, or when its first word starts more than 0.6 s away from the line's real start. Words are then
spread over [line start, next line start - gap] in proportion to their length (a speaking-rate estimate, not ASR).
Prints which lines it touched; leaves good lines alone. Written 2026-11-05 after two lines of the consistent-hashing
reel collapsed onto 84.67 s and 88.7 s.
"""
import json, subprocess, sys
from collections import Counter

def main():
    cap_path, lines_path, wav = sys.argv[1:4]
    caps = json.load(open(cap_path, encoding="utf-8"))
    starts = [l["start"] for l in json.load(open(lines_path, encoding="utf-8"))]
    end = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).decode().strip())
    groups, cur = [], []
    for w in caps:
        cur.append(w)
        if w.get("lineEnd"):
            groups.append(cur); cur = []
    if cur: groups.append(cur)
    if len(groups) != len(starts):
        sys.exit(f"{len(groups)} caption lines vs {len(starts)} voiced lines: not touching it")
    fixed = []
    for i, g in enumerate(groups):
        a = starts[i]
        b = (starts[i + 1] - 0.2) if i + 1 < len(starts) else end - 0.1
        dup = max(Counter(w["startMs"] for w in g).values())
        off = abs(g[0]["startMs"] / 1000 - a) > 0.6
        if dup < 3 and not off:
            continue
        weights = [max(2, len(w["text"])) for w in g]
        tot, acc = sum(weights), 0
        for w, k in zip(g, weights):
            s = a + 0.05 + (b - a - 0.1) * acc / tot
            acc += k
            e = a + 0.05 + (b - a - 0.1) * acc / tot
            w["startMs"], w["endMs"], w["timestampMs"] = round(s * 1000), round(e * 1000), round(s * 1000)
        fixed.append(f"line {i + 1} ({a:.2f}-{b:.2f}s, {len(g)} words)")
    json.dump(caps, open(cap_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("re-timed:", ", ".join(fixed) if fixed else "nothing")

if __name__ == "__main__":
    main()
