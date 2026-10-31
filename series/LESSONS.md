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
