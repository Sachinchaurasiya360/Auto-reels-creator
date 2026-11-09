---
name: topic-to-reel
description: Turn a topic into a finished, post-ready 9:16 Reel / YouTube Short (30-90s, English or Hindi, tech/AI/news niche) - research brief with sources, scored hook, retention-structured script, voiceover (user's cloned voice via Chatterbox, or audio the user supplies such as Sarvam AI), an editor's edit plan, style frames, AI-generated cut-out assets, HyperFrames build, a sound pass to the editor's levels, an anti-slop review, render, and the Instagram caption and YouTube title/description. Use when the user gives a topic and says "make a reel", "make a video on", "short on", "Hindi reel on", or just pastes a topic.
---

# Topic to Reel

One topic in, one `final.mp4` plus post copy out. Every decision is judged the way a senior short-form editor judges it: does a cold viewer stay past second 1, past second 3, past the midpoint, and does the video earn a share or a save. "It looks generated" is a failure even when every rule below is followed, so the rules are a floor, not the goal.

The editor's verdict on the first reel this skill made was "Claude slop": flat clip-art icons, rubber stamps, cards with offset shadows, the same move on every element, whooshes on every cut. The references exist so that never happens again. Read them; don't skim them.

| Reference | Read before |
| --- | --- |
| `references/edit-plan.md` | step 6: thinking like the editor, beat by beat |
| `references/visual-style.md` | steps 7 and 9: colour, hierarchy, type, layout, motion, banned looks |
| `references/assets.md` | step 8: generating and cutting out images |
| `references/sound.md` | step 10: SFX levels, variety, music |
| `references/hindi.md` | any Hindi or Hinglish reel |
| `references/review.md` | step 11: anti-slop pass and technical QA |

## Defaults (change only if the user says so)

- Niche: tech / AI / internet news. Audience: people who use tech, not experts.
- Language: English by default. Hindi/Hinglish when asked (`references/hindi.md`).
- Output: one vertical 1080x1920 video at 30 fps. Target 30-60s; up to 90s is fine for Reels and Shorts when the story needs it. Never pad.
- Voice, in order of preference: audio the user supplies (e.g. Sarvam AI for Hindi), else the user's own voice cloned locally with Chatterbox (`helpers/voiceover.py`). Never ElevenLabs, for voice or transcription (Sachin, 2026-11-02).
- Faceless: no talking head. Visuals are motion design: cut-out photo collage, generated props, real screenshots as receipts, kinetic type.
- No fixed channel palette. Each reel gets its own colour world chosen for its topic (`references/visual-style.md` §1), never the same as the previous reel's (check `reels/LOG.md`).
- SFX library: `reels/_library/sfx/manifest.json` (45 trimmed, normalized sounds; clicks for every kind of edit event).
- Voice profile: `.claude/instagram/voice.md`, if filled in.

## Workspace

`reels/<YYYY-MM-DD>-<slug>/` (gitignored):

```
research.md      brief + sources
hooks.txt        candidate hooks
script.txt       final VO script, one line per utterance
voiceover.wav    the VO (generated or supplied)
edit/            transcripts/ (Scribe word timings)
EDIT_PLAN.md     beat sheet: per beat the idea, the image, the hierarchy, the change, the sound
style/           3 style frames (png) + palette.json
composition/     HyperFrames project (SPEC.md, REVIEW.md inside)
final.mp4, cover.png, post.md, project.md
```

## The process

Three gates: **script** (1), **style frames** (2), **render** (3). If the user says "no stops" / "just make it", skip gates 1-2, decide yourself, and list every decision in the delivery note.

### 1. Research (writes `research.md`)

- 4-8 searches (`extended` for news), then read the primary sources with WebFetch: official posts, filings, company blogs, on-chain analytics, papers. Aggregators are leads only.
- Extract: the one surprising fact, 3-5 concrete specifics (numbers, names, dates, before/after), the common misconception, how it actually works (mechanism, step by step), and what the viewer can do with it.
- Every number in the script has a source URL in `research.md`. When sources disagree, use the conservative figure or drop it. Mark guesses as guesses ("experts suspect").
- Note the date. Say "as of <month year>" where facts will move.
- Collect **receipts** while you research: the exact headline, tweet, filing or chart that proves each key claim. Real screenshots of these become the most credible shots in the reel (`references/assets.md` §3).
- Angle check: why would someone send this to a friend? No answer, no script; find a sharper angle.

### 2. Evidence of what works (optional, ~5 min)

Broad topic or unclear angle: run `/ig-viral` on the niche, then pick a format (myth-bust, "X just did Y", how-it-happened, tutorial-in-60s, comparison, listicle-of-3, story).

### 3. Hook (writes `hooks.txt`)

- 8-10 hooks across formulas in `.claude/skills/ig-reel/hooks.json`; score with `python .claude/skills/ig-reel/hookscore.py <dir>/hooks.txt`. The scorer only reads Latin script: for Hindi, score an English gloss of each hook or judge by hand and say so.
- Pick the top one that is true and that the video pays off.
- Hook speaks in the viewer's time, money or own stuff, never a raw unit ("2 ghante ki movie, 15 minute mein", not "121 vs 303 Mbps"), and kills the obvious objection in the same line ("bina upgrade", "₹0"). Frame 0 shows that pain as a big headline over the real object (series/LESSONS.md 2026-11-09).
- Three layers land together in the first 1.5s: **spoken** (under 3s, concrete noun or number up front), **on-screen** (3-6 words that complement, not transcribe, the spoken line), **visual** (the subject already moving on frame 0; no fade-in, no logo, no title card).

### 4. Script (writes `script.txt`), then gate 1

| time | beat | job |
| --- | --- | --- |
| 0-3s | hook | Stop the scroll. Promise a specific payoff. |
| 3-8s | stakes / open loop | Why it matters to them. Tease the best part ("and who did it is the scary bit"). |
| 8s-end-6s | payoff, stacked | 2-5 beats, each one new concrete information. Midpoint re-hook ("but here's the part nobody's saying"). |
| last 3-6s | close | Land the open loop, one CTA that earns a share/save/comment, ideally a last line that flows back into the hook (loop). |

- Write how people talk. No "Step one / Step two" in the voice; that structure belongs on screen, never in the mouth. Read every line aloud in your head: if no creator would say it, rewrite it.
- Every line is a complete spoken sentence (no clipped headline phrasing) and links to the line before it (so / because / but / now). Explain what a product does and what it is like before naming its parts. Commands, flags and ports go on screen, never in the voice. Max 6 spoken terms, each after its plain meaning.
- Limits and caveats go in the caption and pinned comment, never as the last VO beat before the CTA; the VO picks use cases where the claim is true. Compare to things the viewer already knows or to ₹0, not to foreign paid products. Every scene has a 2-4 word chapter headline that tells the story with sound off; the CTA shows what lands in the DM.
- One idea per line, short sentences. Blank line = longer pause. Numbers written as spoken.
- `python .claude/skills/ig-reel/beats.py <script> --target <secs>` and `python .claude/skills/ig-human/humanize.py <script> --report` (both Latin-only; for Hindi count words yourself at ~165 wpm). No em dashes, no AI slop words.

**Gate 1:** hook + 2 runners-up, the script with beat timings, one line per beat on what the viewer will see. Wait for OK or edits.

### 5. Voiceover and word timings

- **Sarvam API** (Hindi/Hinglish default): `node helpers/sarvam/tts.mjs <dir>/script.txt -o <dir>/voiceover.wav` (`references/hindi.md`).
- **User-supplied audio** (a recording, Sarvam web app): ask for WAV (FLAC fine, MP3 acceptable). Copy it into the reel folder as `voiceover.wav`.
- **Cloned voice**: `.venv-tts/Scripts/python.exe helpers/voiceover.py <dir>/script.txt -o <dir>/voiceover.wav` (needs `voice/reference.wav`; if missing, ask for a 15-30s clean recording and run `--prep-ref`). English only; Hindi needs supplied audio (`references/hindi.md`).
- Word timings: `PYTHONUTF8=1 python helpers/transcribe_local.py <dir>/voiceover.wav --edit-dir <dir>/edit` (add `--lines <dir>/vo_lines` when the voice came from `voice_cast.py`). Local only, no ElevenLabs.
- Diff the transcript against `script.txt`. A word the ASR mishears is a word viewers mishear: regenerate the line, or for supplied audio, fix the caption text by word index and keep the timing.
- Over the target length? Trim pauses, not words: cut silences over 0.35s down to 0.2s, or `atempo` up to 1.08 at most.

### 6. Edit plan (writes `EDIT_PLAN.md`)

Before any pixel, think the whole reel through as the editor would. Follow `references/edit-plan.md`: for every beat, the visual idea (a metaphor or a receipt, never a label), the focal point, the change that happens on screen and on which word, the type treatment of the keyword, and the sound cue. Plan the three retention spikes (hook, midpoint interrupt, payoff) first, then fill between them.

### 7. Look and style frames (writes `style/`), then gate 2

- Choose the colour world, type pair and hierarchy for this reel (`references/visual-style.md`). Write `style/palette.json`.
- Generate the hero assets for three beats: the hook frame, the midpoint interrupt, the payoff (`references/assets.md`).
- Build those three frames as stills in the HyperFrames project and export them (`npx hyperframes snapshot --at <t>`), so the user approves real pixels, not a description.

**Gate 2:** the three frames side by side, the palette with one line on why it fits the topic, and the asset list with its estimated generation cost. Wait for OK or edits. Changing the look here costs minutes; after the build it costs the build.

### 8. Assets

Generate every remaining asset in `EDIT_PLAN.md` in one batch, cut out, tint into the palette, and register them (`references/assets.md`). Estimate cost before spending credits and say the number.

### 9. Build

- Load `/hyperframes` (it routes to its references and `/hyperframes-cli`), and `/hyperframes-registry` before hand-building any named effect.
- Build to `references/visual-style.md` and `EDIT_PLAN.md`. Keep `composition/SPEC.md` with the numbers (palette hexes, type sizes, eases, shot list).
- Use HyperFrames by default. Remotion when a beat needs the React ecosystem (maps, complex data viz); Three.js inside HyperFrames for real 3D objects; Manim for math.
- The kinetic type is the caption system (`references/visual-style.md` §4). Do not stack a caption chip under a headline that says the same thing.

### 10. Sound pass

Follow `references/sound.md`: SFX at -8 to -12 dB under the voice, a different sound for each kind of action, no repeated file within 10s, whoosh at most once per reel, music bed when a source exists.

### 11. Review

`npx hyperframes check --json` to zero errors, then `references/review.md`: the anti-slop pass on the snapshot sheets, the phone-width pass, the sound measurement. Fix every P0 and the P1s, snapshot what you changed. When a sub-agent is available, give it only the sheets and `references/review.md` for a fresh-eyes P0/P1 list.

### 12. Render, then gate 3

- `npx hyperframes render -o ../final_raw.mp4 -q delivery --fps 30`, then loudness to -14 LUFS / -1 dBTP: `ffmpeg -i final_raw.mp4 -c:v copy -af loudnorm=I=-14:TP=-1.0:LRA=11 -c:a aac -b:a 192k -movflags +faststart final.mp4`.
- QA from the rendered file, not the composition: frames at 0, 0.5, 1.5, 3s and every beat boundary; `blackdetect`; `ebur128`; 5 caption words spot-checked against Scribe timings; the loop seam.
- `cover.png` from the strongest frame, readable at the 1080x1350 grid crop.

**Gate 3:** file path, a 3-line summary, what you measured vs only looked at, the weakest shot, every compromise.

### 13. Post copy (writes `post.md`) and log

- Instagram caption via `/ig-caption` (first ~125 characters work alone, one ask, 3-5 search keywords, 3 hashtags), lint with `caption.py`, run `humanize.py` (the word "hack" in a hacking story is literal, not slop).
- YouTube Shorts: title under 60 characters, search term first; 2-3 line description with `#shorts`; 5-8 tags. Cover text 3-5 words.
- Posting notes: time, pinned source comment, in-app music if the export has none, reply to every comment in the first hour.
- Append to `<dir>/project.md` and `reels/LOG.md`: date, topic, hook, length, **palette and style used**, tools, cost. Later performance (views, avg watch %, shares, saves) goes in `LOG.md`; run `/ig-audit` every ~10 reels.

## Anti-patterns (each one has shipped before)

- "Hey guys", "In this video", a logo or title card first.
- A hook the video never pays off; unsourced numbers.
- Spoken "Step one, step two".
- Flat SVG pictograms as the hero of a shot; icons in circles; cards with hard offset shadows on every beat; a rubber stamp on every reveal.
- Whoosh on every cut; SFX louder than the voice; the same sound twice in 10 seconds.
- A caption chip repeating the headline above it.
- The same entrance on every element; everything centred in a stack; a bottom half left empty with nothing designed for it.
- The same visual for 4+ seconds; text in the bottom 420px or under the right action rail.
- Rendering before gate 1, or building before gate 2.
