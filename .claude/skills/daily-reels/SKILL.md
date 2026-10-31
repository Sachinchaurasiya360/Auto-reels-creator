---
name: daily-reels
description: Make today's 3 InternHack series reels end to end (Real Life System Design, Mock Interview, rotating Tool/News/GitHub/Myth): pick non-repeating topics, research, Hinglish scripts, one approval gate, Sarvam voice, Remotion build in series/studio, render, post copy, log. Use when the user types /daily-reels or asks for "today's reels".
---

# Daily reels

Three reels a day for InternHack, built the way `series/PLAN.md` §7 describes. This skill is the
checklist; the plan, the lessons file and the log hold the details and stay the source of truth.

## Read first (every run)

- `series/LESSONS.md`: verdicts on past reels and the rules they produced. Every rule is mandatory.
- `series/log/LOG.md`: what's already made. `series/backlog.md`: ideas per slot.
- `series/library/CATALOG.md`: scenes that already exist. Reuse before building.

## 1. Topics

- `python helpers/topics.py today` gives the slots: A system design, B mock interview, C rotating type.
- Pick 3 (backlog first, or fresh from research for news/GitHub/tool days).
- `python helpers/topics.py check "<topic>" --concepts <ids>` on each. Always pass concepts. A REPEAT
  means pick another; a CONCEPT warning means the reel's main subject must differ.
- Episode numbers: `python helpers/topics.py next --slot A|B|C`.

## 2. Research (3 agents in parallel)

One agent per reel writes `reels/<date>-<slug>/research.md`. Primary sources first; Reddit and X via
web search (`site:reddit.com/...`, `site:x.com ...`); HN and GitHub via `helpers/research.py`. Every
number gets a source URL; mark anything unverified. Each reel must be complete on its own.

## 3. Scripts

- `script.txt`: Roman Hinglish, `*keyword*` for hero words, `I:` / `C:` / `N:` speaker prefixes.
- `script_tts.txt`: the same lines in Devanagari (English tech words stay Latin), **same word count per
  line**. Sarvam mispronounces Roman Hinglish, so it reads this file. Check pairing before the gate.
- One comment driver per reel, different kind from yesterday's (see LOG.md).
- 45-90s; Mohit reads ~190 words/min.

## 4. Gate (the only stop)

Show all 3 together: hook + 2 runners-up, the script, beat-by-beat visuals, and **stills of the hook,
midpoint and payoff** rendered from series/studio next to frames of `reelsdownloader-video-1.mp4`. If
ours has less detail than the reference, rework before showing. Wait for OK or edits.
If the user said "no stops", skip the wait and list every decision at delivery.

## 5. Build (after OK)

```bash
python helpers/voice_cast.py reels/<dir>/script_tts.txt -o reels/<dir>/voiceover.wav
PYTHONUTF8=1 python helpers/transcribe.py reels/<dir>/voiceover.wav --edit-dir reels/<dir>/edit --language hi
#   quota out? -> python helpers/transcribe_local.py reels/<dir>/voiceover.wav --edit-dir reels/<dir>/edit --lines reels/<dir>/vo_lines
mkdir -p series/studio/public/reels/<slug> && cp reels/<dir>/voiceover.wav series/studio/public/reels/<slug>/vo.wav
PYTHONUTF8=1 python helpers/captions_roman.py reels/<dir>/script.txt reels/<dir>/script_tts.txt \
  reels/<dir>/edit/transcripts/voiceover.json -o series/studio/public/reels/<slug>/captions.json --lines reels/<dir>/vo_lines/lines.json
```

- Composition: `series/studio/src/reels/<Name>.tsx` using `Reel` / `Beat` (seconds of the voiceover),
  register in `src/Root.tsx`. Cut on words from captions.json. Library first (`src/series/*`, Remocn,
  snapcn, onda via `Stage` for 16:9 components); any new reusable scene goes into `src/series/` and
  `CATALOG.md`.
- `npx tsc --noEmit`, then `npx remotion render <id> out/<slug>.mp4 --codec=h264 --crf=18`.
- Frame-check every beat from the rendered file (contact sheets); fix overlaps, empty or tiny beats,
  anything that breaks LESSONS.md; re-render.
- `python helpers/finish_reel.py series/studio/out/<slug>.mp4 reels/<dir> --cover-at <s>` (−14 LUFS,
  black-frame scan, cover).

## 6. Post copy and log

- `reels/<dir>/post.md`: Instagram caption (hook line first, one ask, keywords, 3 hashtags), YouTube
  title/description/tags, cover text, pinned comment with sources. `PYTHONUTF8=1 python
  .claude/skills/ig-human/humanize.py <post.md> --report` must say CLEAN.
- `python helpers/topics.py add --json '{...}'` for each reel (with concepts, hook, comment driver, length, path).

## Deliver

File paths, a 2-line summary each, what was measured vs only looked at, the weakest shot in each reel,
anything unverified. When the user gives feedback on a reel, add it to `series/LESSONS.md` (and the
reel's log entry) so it holds for every future run.
