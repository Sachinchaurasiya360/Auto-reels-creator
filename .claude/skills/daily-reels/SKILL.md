---
name: daily-reels
description: Make today's 3 InternHack reels end to end (Andar Kya Hai? English machine teardown, free tool / GitHub repo with comment-to-DM, end-to-end system design; plus Tech News Decoded on big-news days): pull the previous reels' stats from Instagram (no YouTube stats), pick non-repeating topics, research, Hinglish scripts, one approval gate, Sarvam voice, Remotion build on the GPU, render, post copy, log, then schedule all 3 on Instagram and YouTube. Use when the user types /daily-reels or asks for "today's reels".
---

# Daily reels

Three reels a day for InternHack (a fourth on big-news days), built the way `series/PLAN.md` §7 describes. This skill is the
checklist; the plan, the lessons file and the log hold the details and stay the source of truth.

**Doubt rule (Sachin, 2026-11-02):** if something is unclear (a topic, a time slot, whether a post
went through, a platform asking a new question), ask. Otherwise proceed without stopping, apart from the gate in §4.

**Experiment rule (Sachin, 2026-11-06 night): nothing here is fixed.** Format, references, series, slots, length and the
number of reels (3 or 4) follow the stats. §0 must end with "what I'm changing today and why" (1-3 experiments, each with
the metric that proves it), and the gate proposes a 4th reel when a topic is important or a kind clearly converts.

**Daily lineup (Sachin, 2026-11-07, LESSONS same date). @intern.hack is deep tech, anything that looks cool, not only
placement prep.** 3 reels a day + a 4th on big-news days (~3x a week). Judge the lanes after 7 days (Nov 14): cut or
rework the weakest, give the strongest a second slot.

| slot | series | length | language | build |
|---|---|---|---|---|
| A · 9 AM | **What's Inside?** machine teardown (light theme) (rocket engine, flying car, jet engine, F1 brake, PSLV stage...) | ≤150s (~90-120s) | **English** | `anatomy` figure (or Opuscar 3D: Hologram HUD / Exploded Teardown) → `helpers/anatomy_render.mjs` frames → Remotion/ffmpeg + VO + SFX |
| C · 1 PM | **Free tool / GitHub repo** | 35-50s | Hinglish | series/studio (Remotion) |
| B · 7 PM | **System design, end-to-end** (Real Life SD and Mock Interview alternate days) | ≤150s (110-140s) | Hinglish | series/studio (Remotion); Opuscar Blueprint look is an experiment |
| +1 news days | **Tech News Decoded** (Starship, chips, AI launches) | 45-70s | Hinglish | Opuscar Visual Investigation / Satellite Briefing or studio |

- Every reel ends on a **comment keyword** that Sachin's auto-DM answers: teardowns "Comment <WORD>, notes DM mein / I'll DM
  you the notes" (no blueprint PDF from Ep 3, LESSONS 2026-11-08), tools "Comment <WORD>, link DM mein", system design
  "Comment NOTES". Put keyword + what to DM at the top of `post.md` so Sachin can load it.
- Every reel gets the **SFX pass**: a sound on each visual event (clank on part separation, hiss, rumble + boom on
  ignition, tick on counters, paper on cheat sheets/PDF, typing on terminals), from `series/studio/public/sfx`,
  `reels/_library/sfx`, or synthesised with Opuscar `core/audio/sfx.py` (`$LIB=C:/Users/mrsac/lemo-opuscar`).
- Teardowns: facts in `FACTS.md` (claim + source URL); show only sourced numbers; say "model" when it's not exact CAD.
  Third-party figures (e.g. anatomy's MIT Raptor example) are credited in the caption.

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

**Scope (Sachin, 2026-11-02): only the 9 most recent reels** (the last 3 posting days), not the whole history.
Older reels keep the numbers already logged. The grid view counts for every reel come free with one page load, so
use them for the account median; open insights only for those 9.

**No YouTube Studio stats (Sachin, 2026-11-09):** don't open Studio analytics in §0; Instagram only. YouTube is still
used for scheduling in §7.

Use the user's already-open Chrome through the browser-use plugin (`browser_exec`). Reuse the existing
Instagram tab and never touch other tabs (Medium etc.). Recipes are in `publish.md`.

- **Instagram** (@intern.hack): the reels grid view count for every reel, plus likes, comments
  (excluding the account's own) and posted time from each reel page. Try the reel's Insights for
  reach, average watch time and skip rate; if web insights aren't there, say so and use what loads.
- **Write them down:** add `views`, `likes`, `comments` and `watch_pct` (whatever exists) per platform to each
  reel's record in `series/log/topics.jsonl` (keys `ig_*` plus `stats_at`), then
  `python helpers/topics.py log`. Update the same numbers in `.claude/instagram/log.md` (and re-sync it).
- **Goal metrics: views AND follows** (LESSONS 2026-11-02 goal). Per reel: follows and profile visits per
  1,000 reach, saves + shares per reach. A reel that reaches but doesn't convert gets one written "why".
- **Read them** the `/ig-audit` way: outlier multiple and hook formula per reel, top vs bottom, what beat its
  neighbours and the likely reason (hook, topic, length, the variable logged that day). Then `/ig-reply` drafts
  for real comments worth answering.
  Let it drive today's topics and the one variable to change. Note big shifts in `LESSONS.md`.
- **Housekeeping:** reels that went live since the last run still need their pinned comment
  (`post.md` → "Pinned comment"). Post and pin those before anything else.

## 1. Topics

- Slots follow the lineup table above (A teardown, C free tool, B system design; `helpers/topics.py today` still
  prints the old A/B/C meaning until it's updated, so use the table).
- Pick 3 (backlog first, or fresh from research for tool / news days), weighted by what §0 showed works.
  Teardown topics: wow factor + a news hook when there is one (e.g. Tesla Roadster thruster demo, Starship Raptor 3).
  The "next part" promised at the end of a slot's last reel is that slot's topic today (LESSONS 2026-11-02 goal).
- Weekly (or when `.claude/instagram/swipe.md` is older than 7 days): `/ig-viral` on the niche itself (no
  competitor list yet): Instagram search / hashtags in the logged-in Chrome.
- `python helpers/topics.py check "<topic>" --concepts <ids>` on each. Always pass concepts. A REPEAT
  means pick another; a CONCEPT warning means the reel's main subject must differ.
- Episode numbers: `python helpers/topics.py next --slot A|B|C`.

## 2. Research (3 agents in parallel)

One agent per reel writes `reels/<date>-<slug>/research.md`. Primary sources first; Reddit and X via
web search (`site:reddit.com/...`, `site:x.com ...`); HN and GitHub via `helpers/research.py`. Every
number gets a source URL; mark anything unverified. Each reel must be complete on its own.

**Keep the briefs lean (2026-11-08, research was ~25% of a run's tokens):**
- Point the agent at ONE previous research.md of the same slot as the format, not at LESSONS.md (the script step
  applies LESSONS; research only needs facts). Paste the 3-5 lesson lines that change what to look for (e.g. "≤6
  terms", "hook needs the viewer's stake") into the brief instead.
- Ask for at most ~15 sources and ~25 tool calls; stop when every claim the script will need has a URL.
- Ask for a 10-line summary back; the file holds the rest.
- Tool slot: check `.claude/instagram/swipe.md` and the backlog first; only search GitHub trending if neither has a
  fresh pick.
- Teardown slot: research.md + FACTS.md (claim | number | URL | status) only; the figure is a separate step.

## 3. Scripts

- **Teardown (slot A) scripts are English**: plain `script.txt` (Sarvam English voice or Kokoro via Opuscar
  `core/tts/tts.py`; pick one and lock it after the first reel), no Devanagari file. Spine: news/wow hook → whole
  machine → it comes apart, one line per key part with its real number → how it runs (fires / lifts) → the one insane
  number → comment keyword. The other rules below (Hinglish, Devanagari, analogy) are for slots B, C and news.
- `script.txt`: Roman Hinglish, `*keyword*` for hero words, `I:` / `C:` / `N:` speaker prefixes.
- `script_tts.txt`: the same lines in Devanagari (English tech words stay Latin), **same word count per
  line**. Sarvam mispronounces Roman Hinglish, so it reads this file. Check pairing before the gate.
  Write ₹ amounts as hyphenated Hindi number words (`नौ-सौ-निन्यानवे`), one token each; "₹999" is read slowly.
- One comment driver per reel, different kind from yesterday's (see LOG.md).
- **Follow reason** (LESSONS 2026-11-02 goal): "Part N" of a named series, ending on the named next part + follow.
- **One analogy that builds** into the whole mechanism, shown as one evolving scene with an accumulating legend.
- **Voice (locked 2026-11-05, Sachin liked it):** narrator `sunny_hi_reels` (bulbul:v4-flash) at `--pace 1.0`, ~150 wpm;
  cut words if long, never speed up. Narrated slots: one voice. Don't vary the voice any more.
- **Explain the real technology** (LESSONS 2026-11-05): the analogy only opens the door. At least ~40% of the runtime
  names the real components and walks the actual steps in order (with one real number). Mark analogy vs tech lines at the gate.
- **1-2 "you've seen this, here's why" beats** per reel: a glitch the viewer has noticed (lift → bike freezes,
  tall building → GPS 50 m off → teleport) explained by the mechanism just taught.
- **Retention first** (LESSONS.md 2026-11-01; **hard cap 150 s**, Sachin 2026-11-07 night; flow = LESSONS 2026-11-07 (night): every technique enters as the fix to a problem, junior spine, ≤6 new terms), 2+ humour beats and a punchline at every re-hook, everyday Indian examples only, a hook that
  opens a loop closed only in the last 5s, a re-hook every 8-10s, jargon named last, the last line looping
  to the first. Score 3 hooks with `.claude/skills/ig-reel/hookscore.py` (top must be 50+) and run
  `beats.py --target <s>` until clean. The scorer only knows English stake words and `$`; also score an
  English gloss and show both. Pace and format are free to change (voice is locked): vary one per day and log it.
- **Spoken flow check (LESSONS 2026-11-07 late night, Floci Part 3 failed it).** Before the gate, read every VO line
  aloud: (1) a full sentence a person would say, no missing subject/verb ("Resume mein AWS likha hai, par AWS kabhi
  khola bhi nahi?", never "Resume pe AWS, console kabhi khola nahi"); (2) each line linked to the last (toh / kyunki /
  par / ab / phir), no fragments like "Step do. Bucket: s3 mb."; (3) tool/project reels say what the app does, for
  whom, and what it's like ("Google Drive ke share link jaisa") before any service name; (4) commands, flags, ports and
  function names are on screen only, never spoken; (5) ≤6 spoken terms, each after its plain-words meaning. At the
  gate, list the spoken terms and confirm all five.
- Mock interview: interviewer **Arjun**, candidate **Priya** (LESSONS 2026-11-02).
- **Mock interview is technical first (LESSONS 2026-11-06, Part 6 was deleted for this).** The analogy and object
  rules above do NOT apply to slot B. Priya answers like a real candidate: real components, flow in order, one real
  failure + fix, the interviewer's follow-up/trade-off, one real number. ≥75% of lines technical; an example is
  optional and ≤2 lines. The main visual is the labelled architecture diagram. At the gate, tick the topic's
  must-say terms from research.md and show the tech-line %.

## 4. Gate (the only stop)

Show all 3 together: the §0 stats summary, hook + 2 runners-up with their hookscore, the open loop and where it closes, re-hook timestamps, the script, beat-by-beat visuals, and **stills of the hook,
midpoint and payoff** rendered from series/studio next to the reference contact sheets in `series/references/`
(`junior-part1-*`: story + one building scene, from `Video-25627.mp4`, a reel a junior shared, creator unknown; `emudhra-*`: animated mechanism;
`hyderabad-vaccine-*`: news proof). `reelsdownloader-video-1.mp4` is gone. If
ours has less detail than the reference, rework before showing. List the library components each beat reuses, and any component improved or built new. Also propose the posting slots (§7).
Wait for OK or edits. If the user said "no stops", skip the wait and list every decision at delivery.

## 5. Build (after OK)

```bash
python helpers/voice_cast.py reels/<dir>/script_tts.txt -o reels/<dir>/voiceover.wav
mkdir -p series/studio/public/reels/<slug> && cp reels/<dir>/voiceover.wav series/studio/public/reels/<slug>/vo.wav
PYTHONUTF8=1 python helpers/captions_roman.py reels/<dir>/script.txt reels/<dir>/script_tts.txt --fast \
  -o series/studio/public/reels/<slug>/captions.json --lines reels/<dir>/vo_lines/lines.json
```

`--fast` (2026-11-08) times every word from voice_cast's per-line wavs in about a second (median ~130 ms off the ASR
timings). The old CPU transcription took ~16 min and blocked the run. Use the ASR path (`transcribe_local.py`, then
`captions_roman.py ... edit/transcripts/voiceover.json`, then `helpers/fix_caption_lines.py`) only for the number
listen-check (LESSONS 2026-11-02 rule 3) or after a line was edited in an audio tool, and run it in the background.
Local only: no ElevenLabs / Scribe (Sachin, 2026-11-02). An English teardown voice file that spells a unit as several
words ("P S I") must hyphenate it ("P-S-I") so the word counts pair.

- **Reuse first** (LESSONS 2026-11-02): before writing a beat, find the component in `series/library/CATALOG.md` (start with `Kit`, `Transitions`, `Infra`) /
  `src/series/*` / Remocn / snapcn / onda. Close but not right: improve that component. Nothing fits: build it in
  `src/series/` from existing pieces and catalog it. Reel files hold beats only; nothing copy-pasted between reels.
- Composition: `series/studio/src/reels/<Name>.tsx` using `Reel` / `Beat` (seconds of the voiceover),
  register in `src/Root.tsx`. Cut on words from captions.json. Library first (`src/series/*`, Remocn,
  snapcn, onda via `Stage` for 16:9 components); any new reusable scene goes into `src/series/` and
  `CATALOG.md`. Only use `invert` on `Reel` over a dark full-frame background, or captions vanish.
  Keep punch-in targets inside the frame: content at x < 120 or x > 960 gets cut at 1.15-1.2x.
- **Teardown build (slot A):** build or adapt the figure with the `anatomy` skill (lay it out for 1080x1920), then
  `node helpers/anatomy_render.mjs <page.html> <framesDir> <fromS> <toS> [fps] [W] [H]` steps the page's own
  rAF/setTimeout motion on a virtual clock and writes one JPEG per frame (31s ≈ 2m40s). Drive the figure's tour from
  the VO timings, encode with ffmpeg, then overlay captions/VO/SFX in a Remotion composition (`OffthreadVideo`).
  Gotchas (2026-11-07): anatomy pages start their own idle tour **at load**, so the first cue must be
  `{"t":0.05,"key":"Escape"}` (otherwise parts light up during the hook and the first Space closes instead of opens).
  Render light theme with a reel CSS (`--css`, e.g. reels/2026-11-08-raptor-engine/reel-light.css: unfocused parts
  opacity 0.16, the named part orange) so the part reads on a phone. Always pass `--chunks 6` (built in: parallel browsers,
  frames numbered globally; benchmark 2026-11-07: 300 frames 107 s -> 39 s; the cost is the screenshot readback, so
  resolution/raw CDP capture don't help). Delete the old out/*.mp4 before re-rendering.
  **Reuse figures (2026-11-08):** every figure lives in `series/anatomy/<machine>/` (build.mjs, css, html, cues,
  blueprint PDF) and shares `series/anatomy/kit/` (car chassis, wheels/tyres, tanks, nozzles, pumps, pipes, card
  chrome). A new episode adapts the closest existing figure and adds parts to the kit; a figure is only built from
  scratch when nothing in the kit is close. The kit is what makes the teardown slot fast.
- `npx tsc --noEmit`, then `npx remotion render <id> out/<slug>.mp4 --codec=h264 --crf=18 --gl=angle --concurrency=10`.
  Always render on the GPU (Sachin, 2026-11-02); `remotion.config.ts` sets the same defaults. About 3-4.5 min per reel.
- Frame-check every beat from the rendered file with ONE small sheet per reel:
  `python helpers/contact_sheet.py series/studio/out/<slug>.mp4 --every 4` (200 px tiles, stamped with the second).
  Render a full-size still only for a tile that looks wrong, with `node stills.mjs <id> out/sf/<slug> <sec> ...` in
  series/studio (one bundle + one browser for all stills: ~2 s each; `npx remotion still` re-bundles every call: ~15 s each). Fix overlaps,
  empty or tiny beats, anything that breaks LESSONS.md, content below y 1330; re-render. Before the full render,
  check 8-12 stills (one `node stills.mjs` call) tiled with `contact_sheet.py --stills`, not one image each.
  Fonts: every `loadFont()` must pass `weights` + `subsets: ["latin"]`; a bare `loadFont()` pulls every weight on
  every render tab (2026-11-08: ~300 font requests per tab before this was fixed).
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

Recipes in `publish.md`. Default slots for the posting day, IST: **A (teardown) at 9:00 AM, C (free tool) at 1:00 PM,
B (system design) at 7:00 PM**, and a news reel at the next free hour after the story breaks. Use the slots agreed at the gate
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
