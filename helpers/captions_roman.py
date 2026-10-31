"""Word-timed Roman Hinglish captions from a Devanagari voiceover.

Sarvam pronounces Devanagari far better than Roman Hinglish (tested 2026-10-31: Roman "dus" came
out as "do"), but the series shows Roman captions. So every script is written twice, line for line
and word for word:

    script_tts.txt    what Sarvam reads: Devanagari, English tech words in Latin   (चाय वाले को तुमने दस रुपये भेजे)
    script.txt        what the viewer reads: Roman Hinglish                        (Chai waale ko tumne *dus rupaye* bheje)

Scribe transcribes the voiceover (Devanagari + Latin + digits). This aligns Scribe's words to the TTS
words, then hands each TTS word's timing to the Roman word at the same position.

Roman script markup:
    *word*         keyword: shown at hero size (one or two per phrase)
    I: / C: / N:   line prefix = speaker (interviewer / candidate / narrator), for dialogue captions
    blank line     paragraph break (no effect on captions)

Output JSON: [{text, startMs, endMs, timestampMs, confidence, speaker, emphasis}], the shape
@remotion/captions and Remocn's caption-core use, plus our speaker/emphasis fields.

Usage:
    python helpers/captions_roman.py reels/<dir>/script.txt reels/<dir>/script_tts.txt \
        reels/<dir>/edit/transcripts/voiceover.json -o series/studio/public/reels/<slug>/captions.json \
        --lines reels/<dir>/vo_lines/lines.json
Exits 1 if any line's word counts differ between the two scripts (fix the script, not the code).
"""

import argparse
import difflib
import json
import re
import sys
import unicodedata
from pathlib import Path

SPEAKER = re.compile(r"^\s*([ICN]):\s*")
PUNCT = re.compile(r"[\s\"'“”‘’.,!?;:()\[\]…|।—–-]+")
NUMBER_WORDS = {  # Scribe writes digits where the TTS script spells numbers out
    "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पांच": "5", "पाँच": "5", "छह": "6", "सात": "7", "आठ": "8",
    "नौ": "9", "दस": "10", "बीस": "20", "सौ": "100", "हज़ार": "1000", "हजार": "1000", "लाख": "100000",
}


def lines(path: Path) -> list[str]:
    return [l for l in path.read_text(encoding="utf-8").splitlines() if l.strip() and not l.lstrip().startswith("#")]


def key(token: str) -> str:
    t = unicodedata.normalize("NFC", PUNCT.sub("", token)).lower().replace("़", "")
    t = t.replace("₹", "")
    return NUMBER_WORDS.get(t, t)


def parse(roman_path: Path, tts_path: Path):
    roman, tts = lines(roman_path), lines(tts_path)
    if len(roman) != len(tts):
        sys.exit(f"line count differs: {len(roman)} roman vs {len(tts)} tts")
    words, bad = [], []
    for n, (r, t) in enumerate(zip(roman, tts), 1):
        m = SPEAKER.match(r)
        speaker = {"I": "interviewer", "C": "candidate", "N": "narrator"}[m.group(1)] if m else "narrator"
        r = SPEAKER.sub("", r)
        t = SPEAKER.sub("", t)
        rw, tw = r.split(), t.split()
        if len(rw) != len(tw):
            bad.append(f"line {n}: {len(rw)} roman words vs {len(tw)} tts words\n  {r}\n  {t}")
            continue
        for i, (a, b) in enumerate(zip(rw, tw)):
            emph = a.startswith("*") or a.rstrip(".,!?").endswith("*")
            words.append({"roman": a.replace("*", ""), "tts": b, "speaker": speaker, "emphasis": emph,
                          "line_end": i == len(rw) - 1})
    if bad:
        sys.exit("word counts differ (each roman word must pair with one tts word):\n" + "\n".join(bad))
    return words


def align(words: list[dict], scribe: list[dict]) -> None:
    """Give every script word a start/end from the matching Scribe word; interpolate the unmatched."""
    a = [key(w["tts"]) for w in words]
    b = [key(s["text"]) for s in scribe]
    sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "equal":
            for k in range(i2 - i1):
                words[i1 + k]["start"], words[i1 + k]["end"] = scribe[j1 + k]["start"], scribe[j1 + k]["end"]
        elif tag == "replace" and j2 > j1:
            # Same stretch said differently (₹10 vs दस रुपये, "sound box" vs soundbox): spread its time evenly.
            t0, t1 = scribe[j1]["start"], scribe[j2 - 1]["end"]
            n = i2 - i1
            for k in range(n):
                words[i1 + k]["start"] = t0 + (t1 - t0) * k / n
                words[i1 + k]["end"] = t0 + (t1 - t0) * (k + 1) / n
    # Runs of still-untimed words share the gap between their timed neighbours evenly.
    i = 0
    while i < len(words):
        if "start" in words[i]:
            i += 1
            continue
        j = i
        while j < len(words) and "start" not in words[j]:
            j += 1
        t0 = words[i - 1]["end"] if i > 0 else 0.0
        t1 = words[j]["start"] if j < len(words) else t0 + 0.3 * (j - i)
        n = j - i
        for k in range(n):
            words[i + k]["start"] = t0 + (t1 - t0) * k / n
            words[i + k]["end"] = t0 + (t1 - t0) * (k + 1) / n
            words[i + k]["interpolated"] = True
        i = j


def clamp_to_lines(words: list[dict], lines: list[dict]) -> None:
    """No word may start before its own line starts, or end after the next line starts."""
    line, bounds = 0, [l["start"] for l in lines] + [float("inf")]
    for w in words:
        lo, hi = bounds[line], bounds[line + 1]
        w["start"] = min(max(w["start"], lo), hi - 0.08)
        w["end"] = min(max(w["end"], w["start"] + 0.08), hi)
        if w["line_end"]:
            line += 1


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("roman", type=Path)
    p.add_argument("tts", type=Path)
    p.add_argument("scribe", type=Path)
    p.add_argument("-o", "--output", type=Path, required=True)
    p.add_argument("--lines", type=Path, help="vo_lines/lines.json from voice_cast.py: keeps each line's words inside its own line")
    args = p.parse_args()

    words = parse(args.roman, args.tts)
    scribe = [w for w in json.loads(args.scribe.read_text(encoding="utf-8"))["words"] if w.get("type") == "word"]
    align(words, scribe)
    if args.lines:
        clamp_to_lines(words, json.loads(args.lines.read_text(encoding="utf-8")))

    out = []
    for i, w in enumerate(words):
        end = w["end"]
        # Never overlap the next word, never vanish before it starts.
        if i + 1 < len(words):
            end = min(max(end, w["start"] + 0.08), words[i + 1]["start"])
        text = w["roman"] + ("" if i == 0 else "")
        out.append({
            "text": (" " if i else "") + text,  # caption-core expects the space before each token
            "startMs": round(w["start"] * 1000),
            "endMs": round(end * 1000),
            "timestampMs": round(w["start"] * 1000),
            "confidence": 0.5 if w.get("interpolated") else 1,
            "speaker": w["speaker"],
            "emphasis": w["emphasis"],
            "lineEnd": w["line_end"],
        })
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")
    interp = sum(1 for w in words if w.get("interpolated"))
    print(f"{len(out)} words -> {args.output}  ({interp} interpolated, matched {len(words) - interp})")
    return 0


if __name__ == "__main__":
    sys.exit(main())
