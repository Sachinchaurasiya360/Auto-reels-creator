---
name: daily-reels
description: Make today's 3 InternHack series reels end to end (Real Life System Design, Mock Interview, rotating Tool/News/GitHub/Myth): pull the previous reels' stats from Instagram and YouTube, pick non-repeating topics, research, Hinglish scripts, one approval gate, Sarvam voice, Remotion build on the GPU, render, post copy, log, then schedule all 3 on Instagram and YouTube. Use when the user types /daily-reels or asks for "today's reels".
---

# Daily reels

Three reels a day for InternHack, built the way `series/PLAN.md` §7 describes. This skill is the
checklist; the plan, the lessons file and the log hold the details and stay the source of truth.

**Doubt rule (Sachin, 2026-11-02):** if something is unclear (a topic, a time slot, whether a post
went through, a platform asking a new question), ask. Otherwise proceed without stopping, apart from the gate in §4.

## Read first (every run)

- `series/LESSONS.md`: verdicts on past reels and the rules they produced. Every rule is mandatory.
- `series/log/LOG.md`: what's already made. `series/backlog.md`: ideas per slot.
- `series/library/CATALOG.md`: scenes that already exist. Reuse before building.
- `publish.md` (next to this file): the browser recipes for §0 and §7, with the gotchas already hit.
- The Instagram pack setup in `.claude/instagram/`: `voice.md` (who we are, how we sound, what's off limits),
  `log.md` (every post, its hook formula and stats), `brand.md`, and `swipe.md` once `/ig-viral` has run. The ig-*
  skills read these from `~/.claude/instagram/`, so sync first:
  `mkdir -p ~/.claude/instagram && cp .claude/instagram/*.md ~/.claude/instagram/`.
  `voice.md` still has `{{…}}` gaps (positions, proof): ask Sachin once, fill them in, and never invent them.

### Instagram skills used in this run

| step | skill | how |
|---|---|---|
| §0 stats | `/ig-audit` | its metrics, not raw views: outlier multiple (views / account median), hold at 3s, avg watch time, sends and follows per reach when insights give them; top vs bottom side by side; say when n is too small |
| §0 comments | `/ig-reply` | draft replies to real comments under the last reels, sorted by which are worth answering; show them, post the ones Sachin OKs |
| §1 topics | `/ig-viral` | weekly (or when `swipe.md` is older than 7 days): find what's working in Indian tech / placement-prep reels and write `swipe.md` |
| §3 hooks | `/ig-reel` | hook formulas from `hooks.json` (prefer the ones that won in `log.md` / `swipe.md`), `hookscore.py`, `beats.py`, voice from `voice.md` |
| §6 caption | `/ig-caption` + `/ig-human` | `caption.py` lint (all PASS; a WARN on a Hinglish ask like "tag karo" is a known false alarm) and `humanize.py` CLEAN |
| weekly | `/ig-plan`, `/ig-profile` | plan the week from the audit; score the profile if reach is up and follows aren't |

## 0. Stats of the previous reels (first thing, every run)

Use the user's already-open Chrome through the browser-use plugin (`browser_exec`). Reuse the existing
Instagram and YouTube Studio tabs and never touch other tabs (Medium etc.). Recipes are in `publish.md`.

- **Instagram** (@intern.hack): the reels grid view count for every reel, plus likes, comments
  (excluding the account's own) and posted time from each reel page. Try the reel's Insights for
  reach, average watch time and skip rate; if web insights aren't there, say so and use what loads.
- **YouTube Studio** (channel `UCsBOnrfOFU-v_wPRu_VH7EA`, Shorts tab): views, likes, comments, and
  from each Short's analytics the average view duration / % viewed and "viewed vs swiped away".
- **Write them down:** add `views`, `likes`, `comments` and `watch_pct` (whatever exists) per platform to each
  reel's record in `series/log/topics.jsonl` (keys `ig_*`, `yt_*`, plus `stats_at`), then
  `python helpers/topics.py log`. Update the same numbers in `.claude/instagram/log.md` (and re-sync it).
- **Read them** the `/ig-audit` way: outlier multiple and hook formula per reel, top vs bottom, what beat its
  neighbours and the likely reason (hook, topic, length, the variable logged that day). Then `/ig-reply` drafts
  for real comments worth answering.
  Let it drive today's topics and the one variable to change. Note big shifts in `LESSONS.md`.
- **Housekeeping:** reels that went live since the last run still need their pinned comment
  (`post.md` → "Pinned comment"). Post and pin those before anything else.

## 1. Topics

- `python helpers/topics.py today` gives the slots: A system design, B mock interview, C rotating type.
- Pick 3 (backlog first, or fresh from research for news/GitHub/tool days), weighted by what §0 showed works.
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
  Write ₹ amounts as hyphenated Hindi number words (`नौ-सौ-निन्यानवे`), one token each; "₹999" is read slowly.
- One comment driver per reel, different kind from yesterday's (see LOG.md).
- **Retention first** (LESSONS.md 2026-11-01): 60-80s (max 90s, ~190-250 words at 190 wpm; LESSONS 2026-11-01 later), 2+ humour beats and a punchline at every re-hook, everyday Indian examples only, a hook that
  opens a loop closed only in the last 5s, a re-hook every 8-10s, jargon named last, the last line looping
  to the first. Score 3 hooks with `.claude/skills/ig-reel/hookscore.py` (top must be 50+) and run
  `beats.py --target <s>` until clean. The scorer only knows English stake words and `$`; also score an
  English gloss and show both. Voice, pace and format are free to change: vary one per day and log it.
- Mock interview: interviewer **Arjun**, candidate **Priya** (LESSONS 2026-11-02).

## 4. Gate (the only stop)

Show all 3 together: the §0 stats summary, hook + 2 runners-up with their hookscore, the open loop and where it closes, re-hook timestamps, the script, beat-by-beat visuals, and **stills of the hook,
midpoint and payoff** rendered from series/studio next to frames of `reelsdownloader-video-1.mp4`. If
ours has less detail than the reference, rework before showing. List the library components each beat reuses, and any component improved or built new. Also propose the posting slots (§7).
Wait for OK or edits. If the user said "no stops", skip the wait and list every decision at delivery.

## 5. Build (after OK)

```bash
python helpers/voice_cast.py reels/<dir>/script_tts.txt -o reels/<dir>/voiceover.wav
PYTHONUTF8=1 python helpers/transcribe.py reels/<dir>/voiceover.wav --edit-dir reels/<dir>/edit --language hi
#   quota out? -> python helpers/transcribe_local.py reels/<dir>/voiceover.wav --edit-dir reels/<dir>/edit --lines reels/<dir>/vo_lines
mkdir -p series/studio/public/reels/<slug> && cp reels/<dir>/voiceover.wav series/studio/public/reels/<slug>/vo.wav
PYTHONUTF8=1 python helpers/captions_roman.py reels/<dir>/script.txt reels/<dir>/script_tts.txt \
  reels/<dir>/edit/transcripts/voiceover.json -o series/studio/public/reels/<slug>/captions.json --lines reels/<dir>/vo_lines/lines.json
```

- **Reuse first** (LESSONS 2026-11-02): before writing a beat, find the component in `series/library/CATALOG.md` (start with `Kit`, `Transitions`, `Infra`) /
  `src/series/*` / Remocn / snapcn / onda. Close but not right: improve that component. Nothing fits: build it in
  `src/series/` from existing pieces and catalog it. Reel files hold beats only; nothing copy-pasted between reels.
- Composition: `series/studio/src/reels/<Name>.tsx` using `Reel` / `Beat` (seconds of the voiceover),
  register in `src/Root.tsx`. Cut on words from captions.json. Library first (`src/series/*`, Remocn,
  snapcn, onda via `Stage` for 16:9 components); any new reusable scene goes into `src/series/` and
  `CATALOG.md`. Only use `invert` on `Reel` over a dark full-frame background, or captions vanish.
  Keep punch-in targets inside the frame: content at x < 120 or x > 960 gets cut at 1.15-1.2x.
- `npx tsc --noEmit`, then `npx remotion render <id> out/<slug>.mp4 --codec=h264 --crf=18 --gl=angle --concurrency=10`.
  Always render on the GPU (Sachin, 2026-11-02); `remotion.config.ts` sets the same defaults. About 3-4.5 min per reel.
- Frame-check every beat from the rendered file (contact sheets); fix overlaps, empty or tiny beats,
  anything that breaks LESSONS.md; re-render.
- `python helpers/finish_reel.py series/studio/out/<slug>.mp4 reels/<dir> --cover-at <s>` (−14 LUFS,
  black-frame scan, cover).

## 6. Post copy and log

- `reels/<dir>/post.md`: Instagram caption (hook line first, one ask, keywords, 3 hashtags), YouTube
  title/description/tags, cover text, pinned comment with sources. `PYTHONUTF8=1 python
  .claude/skills/ig-human/humanize.py <post.md> --report` must say CLEAN.
- Caption lint: `PYTHONUTF8=1 python .claude/skills/ig-caption/caption.py <caption.txt> --keywords "<search terms>"`.
- **Notes page on InternHack (every reel, in English):** write `C:\CodeBase\InternHack\client\src\module\notes\posts\<slug>.md`
  from the reel's `research.md` only (facts and sources from there, nothing new). Front matter: `title`, `description`,
  `date`, `author: InternHack Team`, `category`, `tags: [..]`. Free part: a short intro + the first `##` section;
  then `<!-- locked -->`, the deeper sections (a ```` ```mermaid ```` diagram, edge cases, an "How to answer this in an
  interview" section, and the answer to the reel's comment-driver question); then `<!-- unlocked -->` and `## Sources`.
  Copy the shape of `posts/fastag.md`. Run `npx vitest run src/module/notes` in `client/`, then commit and push
  InternHack without asking (Sachin, 2026-11-01); the push deploys. Once live, check
  `https://www.internhack.xyz/notes/<slug>` loads with the right title.
- Put the notes link in `post.md`: the pinned comment starts with
  `Full notes (diagram + interview answer): internhack.xyz/notes/<slug>?utm_source=ig&utm_medium=comment&utm_campaign=<slug>`
  (`utm_source=yt` for YouTube), and the caption's last line says "Full notes: link in bio / pinned comment".
- `python helpers/topics.py add --json '{...}'` for each reel (with concepts, hook, comment driver, the real final length, path),
  and a row in `.claude/instagram/log.md` with the hook's formula id.

## 7. Publish: schedule all 3 on Instagram and YouTube (after the build, no extra stop)

Recipes in `publish.md`. Default slots for the posting day, IST: **A at 9:00 AM, C at 1:00 PM, B at 7:00 PM**
(news at lunch while it's fresh, interview in the evening when students are free). Use the slots agreed at the gate
if they differ; if the §0 stats show a better hour, propose it at the gate.

- **Instagram:** Create → Post → `final.mp4` → crop **9:16** → cover `cover.png` → caption from
  `post.md` → Schedule content → date + time → Schedule. AI label off for drawn animation.
- **YouTube Studio:** upload `final.mp4` → title, description and tags from `post.md`; "Not made for kids";
  altered content "No" → Visibility → Schedule → date, and the **time picked from the dropdown list**
  (typed times don't commit and save as 00:00) → Schedule.
- **Verify every one:** Instagram `instagram.com/scheduled_content/` shows each caption under its time;
  each YouTube Short's Studio visibility shows the right date and time after a reload. Fix any mismatch.
- Add `ig_scheduled` / `yt_scheduled` (ISO time) and `yt_url` to each reel's record, then `topics.py log`.
- Pinned comments can't be scheduled: they're done in §0 of the next run, or by the user once the reel is live.

## Deliver

The §0 stats table, then file paths, each reel's live notes URL, a 2-line summary each, what was measured vs only looked at, the weakest shot in each reel,
anything unverified, and the posting schedule (platform, time, link) as verified in §7. When the user gives
feedback on a reel, add it to `series/LESSONS.md` (and the reel's log entry) so it holds for every future run.
