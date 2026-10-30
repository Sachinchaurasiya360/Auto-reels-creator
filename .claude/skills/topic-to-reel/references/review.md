# Review: anti-slop pass and technical QA

Run after `npx hyperframes check --json` reports zero errors. Look at the sheets as a harsh senior editor seeing the reel once, on a phone, with the sound off, then again with sound.

## 1. Sheets to make

- `npx hyperframes snapshot --review` (beats, seams, phone width).
- `npx hyperframes snapshot --at <every spike and beat boundary>`.
- After render: frames pulled from `final.mp4` itself (fonts and media can differ from the preview).

## 2. Anti-slop questions (any "yes" is a P0)

1. Does any shot use a flat icon or clip-art as its subject?
2. Is there a rubber stamp, tape wipe, glitch or "HACKED" screen more than once?
3. Do two consecutive beats use the same entrance move or the same transition?
4. Is any frame three centred elements in a stack?
5. Is there a caption box repeating words that are already big on screen?
6. Does any frame have more than one focal point, or none?
7. Is any stretch of 3+ seconds without a change on screen?
8. Would a stranger need the voice to understand what any image is? (Describe each beat frame in one sentence naming its objects; an object you'd have to explain fails.)
9. Does the reel look like the last reel? (Compare with the previous `cover.png`.)
10. Does any sound play with no visible cause, or the same sound twice within 10s, or a whoosh more than once?

## 3. Editor questions (each "no" is a P1)

- Is frame 0 a thumbnail you'd stop for, readable at grid size?
- Is the midpoint interrupt the biggest visual change in the reel?
- Is the payoff one image worth a screenshot?
- Do the pictures alone (words covered) tell the story in order?
- Does every key claim have a receipt or a source on screen when it's made?
- Does the speed vary (fast stretches and held beats)?
- Does the last frame loop into the first?
- Does the colour world fit the topic and differ from the last two reels?

## 4. Technical checks

- Safe zones: no words below y 1330, right of x 940, or above y 220.
- Type: nothing under 28px; every line held at least 0.5s + 0.3s per word.
- Captions: 5 words spot-checked against the Scribe timings; corrected ASR words show their fixed spelling.
- Sound: `npx hyperframes audio final.mp4 --json` shows SFX peaks at least 8 dB under the voice; integrated -14 LUFS (±1), true peak ≤ -1 dBTP.
- `ffmpeg -i final.mp4 -vf blackdetect=d=0.1 -an -f null -` finds nothing.
- 1080x1920, 30 fps, H.264 yuv420p, AAC 48 kHz.

## 5. Notes and fixes

One line per problem: `t=4.2s · where · problem → exact change`. Rank P0 (breaks the read, a slop item, wrong fact), P1 (weakens retention), P2 (polish). Fix all P0s and the P1s worth their time, snapshot only what changed, then render. Put the short version in the delivery note with what was measured and what was only looked at.
