# Lessons from shipped reels

Read before writing the edit plan for any series reel. Each entry is a verdict from Sachin plus the
concrete rules it produced. Rules here override anything looser in PLAN.md or the topic-to-reel skill.

## 2026-10-31 · Mock Interview Ep 1 (rate limiter): "animation quality not up to the mark"

What was wrong (diagnosed from the rendered frames, compared with the UPI reel and the
`reelsdownloader-video-1.mp4` reference):

- **No real-life objects.** UPI had a phone, a QR standee and a soundbox; the rate limiter was all
  abstract: random dots, plain rectangles labelled "Server", a flat SVG bucket. Nothing a viewer has held.
- **The interview wasn't shown.** The format promises two people talking; on screen there was no
  interviewer or candidate, only a caption chip. The iMessage chat component was installed and unused.
- **Mechanisms didn't animate cause → effect.** Tokens just vanished from the bucket; no request was
  seen arriving, taking a token, or bouncing back as a 429. The Redis "race" was two text boxes.
- **Slides, not motion.** Four text/code cards (429 response, Lua, fail-open/closed, answer card) and the
  same blur-fade entrance on every element. Camera only did a 2-4% push; no punch-ins, no object transitions.
- **Too small.** Server boxes ~180px wide, labels 22-30px, a busy middle band and an empty lower third.
- **Noise as visuals.** The request "flood" was random dots that read as static, not as people or bots.

Rules from now on (all reels, interview episodes especially):

1. **Every beat has a real object** from the story's world: the IRCTC app on a phone, a Tatkal booking
   screen, a laptop, a person. Boxes and arrows only sit around or behind it.
2. **Interview episodes show both people**: a video-call or across-the-table layout with the interviewer
   and candidate as drawn avatar cards with a speaking indicator, or the chat thread itself. Never only a caption chip.
3. **Animate the mechanism as cause → effect, one object at a time**: request packet travels in, hits the
   thing, the thing visibly changes (token pops out, counter ticks, lock turns), the result travels back
   to the phone. If the viewer can't point at what changed, the beat isn't done.
4. **Size floor**: the hero object is at least 45% of the frame width; any label is at least 32px; one
   focal subject per beat, filling the 560-1320 band.
5. **Motion floor**: a punch-in (115-130%) at least every ~10s on the detail that matters; 3+ different
   transition kinds per reel (object grows into next scene, match cut, colour flood, hard cut on a word);
   no single entrance style used for everything.
6. **At most one text/code card per reel.** Code appears in context (an editor, zoomed onto one line).
7. **Crowds are people or devices**: avatars, phones, booking requests with names, never anonymous dots.
8. **Style-frame check before the full build**: render the hook, the midpoint and the payoff as stills
   and compare side by side with `reelsdownloader-video-1.mp4`. If ours has less detail than the
   reference, rework before building the rest.

## 2026-11-01 · Scripts don't make people want to watch to the end

Sachin, on the Nov 1 scripts (FASTag, idempotency, incognito): "the video or the script are not making
the curiosity to watch the entire video ... attention span has been reduced, so we need to make the
script unique so that people can watch the entire video." Goal is reach: "there is no blocker that you
have to use the same voice, same story ... whatever is required, just do it and make it viral."
The Nov 1 reels shipped as approved; these rules apply from the Nov 2 run onward.

What was wrong (diagnosed from the scripts):

- **The hook got answered early.** FASTag answered its own hook by 0:30, then ran another 40s of facts.
- **Too long and textbook-paced.** 54-82s, every line a fact, and no line gave a reason to stay for the next one.
- **No open loop.** Nothing was promised for later, so leaving early cost the viewer nothing.
- **Jargon before story.** "Acquirer", "registry", "idempotency key" were named before the viewer cared.
- **Endings didn't loop.** The last line didn't call back to the first, so there was no seamless replay.

Rules from now on (every reel):

1. **30-45s, hard max 50s.** If the topic needs more, cut it, or split it into two reels.
2. **The hook opens a loop that only closes in the last 5s.** It's personal ("tumhara paisa", "tumhara
   data"), concrete (a number, a time, a place) and slightly uncomfortable. Write 3 hooks from different
   formulas in `.claude/skills/ig-reel/hooks.json` and score them with `hookscore.py`. Show the scores at
   the gate. Under 50 means it isn't the hook yet.
3. **No setup lines.** Line 1 is the most surprising claim, started mid-action. Line 2 is the stake
   ("aur yahi gap ek din tumhara ₹125 kha jaayega").
4. **Re-hook every 8-10s.** A turn line ("par yahin twist hai", "aur yahi part sabko galat pata hai")
   or a question the next beat answers. Every beat ends on tension, never on a closed fact.
5. **Story first, name last.** Explain through the viewer's own situation; reveal the jargon term near
   the payoff ("isko kehte hain idempotency").
6. **Cut any fact with no consequence for the viewer.** If the line doesn't change what they'd do, or
   what they'd feel about their money, data or interview, delete it.
7. **The last line loops to the first.** Echo the hook's word or image so the replay lands clean.
8. **Explore freely and log what wins.** Voice, pace (`voice_cast.py --pace 1.1-1.15`), POV, cold open,
   countdown, story framing are all open. Vary one thing per day and record it in the log entry, so
   `/ig-audit` can tell what moved watch-through.
9. **Gate shows retention, not just content.** The hook scores, the open loop and where it closes, the
   re-hook timestamps, and the `beats.py --target` result with every flag fixed.

## 2026-11-01 (later) · Length back to 60s+, add humour, keep it day-to-day

Sachin, after seeing the Nov 1 numbers (FASTag 1,434 views in 7h, idempotency 936 in 2h, both 75-84s;
older reels 130-290): "we can go with the 60s+ reels ... you would not be able to cover the topic
explanation in details. If possible include the humor, punch line, all should be real life day to day
friendly things."

This **replaces rule 1 of the 2026-11-01 entry** (30-45s). Every other retention rule there still holds.

1. **60-80s, hard max 90s.** The length goes to explaining the mechanism properly, not to extra facts:
   rule 6 (cut facts with no consequence for the viewer) still applies.
2. **At least 2 humour beats per reel**: a relatable joke from Indian daily life (mummy, chai waala,
   auto waala, hostel wifi, the friend who never pays back), a deadpan line, or the system "speaking"
   as a character. The joke carries the explanation; it never stops it.
3. **A punchline at every re-hook** (every 8-10s): each beat ends on a twist or a laugh line, not a fact.
4. **Every example is from the viewer's own day**: their phone, their payment, their commute, their
   exam, their WiFi. No enterprise or foreign-company framing unless it lands back on the viewer.
5. **The last line is the best punchline** and loops to the hook (rule 7 above).

## 2026-11-02 · Interview characters have names

Sachin: "the two character you have in interview you can give them some name."
The interviewer is **Arjun** and the candidate is **Priya** in every Mock Interview episode. The names show
on the call tiles and in the caption speaker chip ("Arjun · Interviewer", "Priya · Candidate",
`series/studio/src/series/Captions.tsx`). Scripts may use the names in dialogue ("Priya, galti kiski?").

## 2026-11-02 · Reuse the library, improve it, build new last

Sachin: "always check the existing one since we must have most of the things; we can improve each component
as per our requirements; based on the components we can build one."

Audit of the Nov 2 reels: `Bleed` was copy-pasted in 5 reels, `Pop` in 3, two different `Db` drawings, and
Server / Envelope / Store / Stamp / Bubble / the caption call strip were reel-local. Moved into
`src/series/Layout.tsx`, `Infra.tsx` and `People.CaptionCall` (pixel-identical, SSIM 0.99).

1. Before the edit plan, list the library components each beat will use (`series/library/CATALOG.md`,
   `src/series/*`, Remocn / snapcn / onda). Show the list at the gate.
2. Close but not right: extend that component (prop or variant). Never redraw it inside the reel.
3. Nothing fits: build it in `src/series/` from existing pieces, add it to CATALOG.md, then use it.
4. Reel files hold beats only. No helper is defined in more than one reel.
