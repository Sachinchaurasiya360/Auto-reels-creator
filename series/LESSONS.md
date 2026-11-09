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

## 2026-11-02 · Numbers spelled out, max 2 voices

Sachin, on Mock Interview Ep 3 (cache): "insted of pronouncing the 'do hazar pandrah' which is two
thousand fifteen you said 'two sunya ek panch'" and "don't use more than 2 voice in a single video".
The script had `2015` (and `12 बजे`, `13 गुना`) as digits, and used three voices (Arjun, Priya and a narrator).

1. **No digits in `script_tts.txt`.** Sarvam hi-IN reads digits one by one. Write every number the way a
   person says it: years `दो हज़ार पंद्रह`, times `बारह बजे`, counts `तेरह गुना`, money `नौ-सौ-निन्यानवे`.
   Digits are fine in `script.txt` and on-screen captions. `helpers/voice_cast.py` refuses to voice a line with digits.
2. **At most 2 voices per reel.** Mock Interview: Arjun (`I`) and Priya (`C`) only, no narrator (`N`); the
   explainer lines go to Arjun or Priya in dialogue. Narrated slots: one narrator, plus at most one
   other voice. `voice_cast.py` refuses a script with more than 2 speakers.
3. **Listen-check numbers before the render**: transcribe the voiceover and confirm every number came
   back as words, not digit-by-digit.

## 2026-11-02 · Goal is views AND follows: series spine, one building analogy, slower voice

Sachin: "whatever you mention incorporate this, goal view and follows". From the stats: since Nov 1 every reel
reaches 1.2-1.6k (98-99% non-followers) but only **2 follows from ~6,700 views**. Reference: a reel his junior (a viewer) shared, creator unknown:
`Video-25627.mp4` (repo root, "System Design Part 1/30"): one narrator, a calm pace, one chai-tapri analogy that
builds into servers / load balancer / cache / reliability in one evolving scene, a real proof (IRCTC Tatkal
load bar to HANG), and "Next: Part 2/30" + a reason to follow. No competitor list yet (Sachin will share later).

1. **Every reel gives a reason to follow.** Number it as a part of a named series ("Part 5 · Real Life System
   Design") and end on the **named next part** ("Agla part: Swiggy ka live map. Follow karo, kal aayega").
   Then that next part really is the next reel of that slot: put it at the top of `series/backlog.md`.
2. **One analogy per reel that builds.** Pick one everyday scene (chai tapri, shaadi, hostel mess) and let it
   grow beat by beat into the whole mechanism, on screen as **one evolving scene** with a legend that
   accumulates (each concept added as a tag). Jokes come out of that scene; no new mini-analogy every beat.
3. **Slower voice.** `voice_cast.py --pace 1.0-1.1` (not 1.25), about 150 words a minute: 60-80s = 150-200
   words. If the reel runs long, cut words, never speed up. (Nov 3 reels shipped at 1.25: compare their hold.)
4. **Try one voice.** Narrated slots: one narrator. Mock Interview may test a single narrator telling the
   interview as a story against Arjun + Priya; log which one ran.
5. **Measure follows.** §0 reads follows and profile visits per 1,000 reach, and saves + shares per reach,
   next to views; a reel that reaches but doesn't convert gets a written "why" (no follow reason? no series?).
6. **Instagram vs YouTube side by side.** Open each recent Short's YouTube analytics (viewed vs swiped away,
   average view duration) and write why the same reel did differently on each platform.
7. **Trends weekly, without a competitor list.** Run `/ig-viral` on the niche itself (Instagram search /
   hashtags in the logged-in Chrome: system design Hindi, placement prep, tech news India), keep
   `.claude/instagram/swipe.md`, and let it steer topics and hook formulas.

## 2026-11-03 · From the stats: news needs a "tumhara" stake; YouTube titles must be searchable

Not a verdict from Sachin; read from the §0 numbers (9 recent reels).

- NavIC NVS-03 got 158 views in 7h with 19.7% of views from followers (the other reels: ~1%): Instagram never
  tested it on strangers. Binance and Anthropic (news about an institution's money) stalled at ~160 the same way.
  CNAP, also news, did 1,715 because it was about the viewer's own name.
- YouTube: FASTag reached 656 and OTP 83 with question titles people type into search ("... kyon nahi?",
  "... late kyun aata hai?"). Interview Shorts titled "Mock Interview: X" got 0-4.

1. **Slot C (news, tool, myth) leads with the viewer's own stake** in the hook and the first 3 seconds: their phone,
   money, name, exam, laptop. "India / ISRO / a company did X" alone is not a hook; say what changes for *them*.
2. **YouTube titles are the search query**: a Hinglish "kyon / kaise / kya" question a student would type, the
   concept word in it ("Load balancer kya hai? ..."), and "Mock Interview" only after the question, if at all.

## 2026-11-03 · NavIC reel: too many components, hard to follow

Sachin, on Tech News #3 (NavIC NVS-03): "you introduce too much components in the video, the satellite, ghadi and
other ... it create difficult for the user ... don't make that much complicated. I shared you my junior's reel
yesterday, that is quite good, the story is." (Reference: `Video-25627.mp4`, contact sheets `series/references/junior-part1-*`.)
It also got 158 views in 7h (see the stats entry above): viewers left early.

Sachin, clarifying: "for junior I am not saying the UI, it's story." What to copy from that reel is **how the story
is told**, not its visual style (our look stays ours): a simple everyday situation ("app banayi, sab smooth chal raha
tha"), the problem gets worse ("ek crore log aa gaye, payment fail, website crash"), then one analogy (one chai
tapri) that grows step by step, and each concept arrives only when the story needs it ("toh kya karoge?" → more
stalls = servers → a manager = load balancer). The viewer follows one storyline from start to end.

1. **One story, one scene, few objects.** A reel introduces at most **3 new objects/ideas** in total (e.g. phone,
   server, friend's phone). If the topic needs a 4th, cut it or save it for the named next part.
2. **Each new object stays on screen and builds**: it is added to the same scene, never swapped for a new drawing.
   No beat brings in an object that isn't used again later.
3. **Simple over complete.** Drop side facts (history, launch details, extra numbers) even if true. The viewer should
   be able to retell the reel in two sentences.
4. **Story test:** each new concept answers a "toh ab kya?" the story just raised. If a concept could be cut without
   breaking the storyline, cut it.
5. **Gate check:** list the objects the reel introduces, in order. More than 3, or one used only once: rework
   before showing.

## 2026-11-05 · Sunny voice locked; explain the technology, not just the example; keep the "why you've seen this" beats

Sachin, on the 2026-11-05 reels (Swiggy live map, message queue, TRAI): "yesterday reels sound is good, you can use
that sound now onwards in all the reels ... you use example but I think you forgot to explain the actual technology,
instead you focused on the example ... also I like the fact that you explain lift me [network jaata hai], [building se
GPS] door dikhata hai, check these things."

1. **Voice is fixed:** narrator `sunny_hi_reels`, Sarvam `bulbul:v4-flash`, `--pace 1.0` (the `voice_cast.py` default).
   Mock Interview keeps Arjun + Priya. Voice is no longer a daily variable; vary something else.
2. **The analogy is the door, the technology is the room.** The everyday example (mummy's calls, the chitthi) only
   sets up the idea; then the reel names the real parts and says what each one actually does, in plain words, on
   screen with its real name: e.g. "rider app GPS padhta hai → har 4-5 sec server ko location bhejta hai → server
   ek khuli connection (MQTT) pe tumhare app ko push karta hai → app beech ke points smooth karta hai". The
   Swiggy reel spent most of its time on the example and named MQTT only in one line at the end.
   **Budget:** at least ~40% of the runtime explains the real mechanism (real component names, the actual steps
   in order, one real number), not the analogy. Jargon still comes after the story makes it needed, but it comes
   with an explanation, not just a label.
3. **Keep "you've seen this, here is why" beats.** Sachin liked: "lift mein network gaya → bike freeze" and "unchi
   building se GPS 50 meter bhatakta hai → bike teleport". Each reel should have 1-2 of these: a glitch or oddity
   the viewer has personally noticed, explained by the mechanism just taught. These double as proof that the
   technology explanation is right.
4. **Gate check:** before showing scripts, mark which lines are analogy and which explain the real technology;
   if the technology lines are under ~40% or have no real component names, rework. List the "you've seen this"
   beats for each reel.

## 2026-11-05 · From the stats: young reels aren't stalled; tools get saved; interview hooks need the viewer's stake

Not a verdict from Sachin; read from the §0 numbers (9 recent reels, stats at 16:50).

- WhatsApp (229 at 5h → 1,187) and Floci (121 at 1h → 1,269) were judged "stalled" on Nov 4 and weren't. Don't call a
  stall before ~20h.
- Real stalls: Load balancer (151 at 21h, 14% followers) and DB index (317 at 2d), both 7 PM interview reels whose
  hook was a system question ("cart gayab, kyun?", "index laga tha, kyun?"). Cache and idempotency (the viewer's money
  taken) did 1.2k from the same slot.
- Floci got 26 saves + 9 shares from 1,155 reach (30 per 1k, 3-6x every other reel): a usable free tool is save-worthy.
- 0 real comments on all 9; follows 0.4 per 1k reach.

1. **Judge a reel at 20h+**, not earlier. Earlier numbers go in the log as "age Xh", never as a verdict.
2. **Mock Interview hooks open on the viewer's own loss** (money, marks, order, data), then the interviewer's
   question; a pure system question ("X kyun hua?") is not the hook.
3. **Test a save frame**: the last 3-4 s show a one-screen cheat sheet worth saving ("save karo, interview se pehle"),
   looping to the hook. Log whether saves per 1k reach move on non-tool reels.

## 2026-11-06 · Mock Interview Part 6 deleted: the example replaced the system design

Sachin: "what a shit video you have explained the biryani and other stuff where is the actual system design I have
asked you to give example but it doesn't mean that you will remove the actual technical things and put only example
i deleted that reels due to ashamed also check the part 5 of mock interview that have also very less views"

What went wrong:
- **Part 6 (message queue)**: 17 lines, 15 of them about the dhaba (parchi, taar, cook chai pe, cook behosh). The real
  system showed up once, as two labels near the end ("taar ko kehte hain queue, phaadna ack"). Never said: producer,
  broker, consumer, at-least-once delivery, offset/commit, retry + dead-letter queue, dedupe on order_id in the DB.
- **Part 5 (load balancer)**: khidki / guard / chai-pe uncle. No round robin or least connections, no `/health`
  endpoint, nothing on L4 vs L7; Redis was a name, not an explanation. 151 views at 22h.
- **Part 7 (consistent hashing, today)**: delivery boys and parcels; `hash(key) % N` is only in the caption.
- The numbers agree with him: the interview reels with the most real terms (Part 2 idempotency: unique constraint,
  Redis SET NX, 409, 422; Part 3 cache: TTL, versioned writes, request coalescing) did **1.2k and 1.16k**. The
  analogy-only Part 5 did 151, Part 4 did 317.
- Root cause: the slot A storytelling rules (one building analogy, max 3 objects, story first / name last, simple
  over complete) were applied to the interview slot and pushed the technology out. The 2026-11-05 "40% technology"
  rule was not checked on Part 6 or Part 7.

Rules for **Mock Interview (slot B)**. These override the analogy and object rules of 2026-11-02 and 2026-11-03 for this slot:
1. **It is an interview.** Priya answers the way a strong candidate answers a real interviewer: real component names,
   the real request flow, real failure handling. The technology *is* the content.
2. **The example is optional and small.** It gets at most one example, used for 1-2 lines (about 10% of runtime) to make one
   step click, and then the script goes straight back to the system. The example never carries the twist: the twist is a real
   failure ("consumer ne DB mein likha, offset commit se pehle crash → message dobara aaya").
3. **At least 75% of the lines carry a real term or a real step.** Every interview reel covers all five:
   (a) the components by their real names, (b) the flow in order, (c) one failure mode and what the system does about it,
   (d) the follow-up or trade-off the interviewer asks next, (e) one real number or real company setup.
4. **The main visual is the real architecture**: labelled boxes and arrows (Order Service → Kafka topic → Restaurant
   consumer → DB) with messages moving, offsets ticking, a node going red. A real product screen (the Zomato order
   screen) can be the hook. Everyday-life drawings appear only as a small inset, if at all.
5. **Gate check:** from research.md, list the must-say terms an interviewer expects for the topic and tick each one
   in the script. If any is missing, rework the script. Show the tech-line % at the gate. A script that would make sense
   with every technical word removed fails.
6. The hook still opens on the viewer's own loss (2026-11-05). The loss is the stake, and the system is the answer.

## 2026-11-06 (later) · Caching reel was hard to follow; names covered the faces; stop reusing one look

Sachin, comparing Part 5 (load balancer) with a reference that covers round robin / least connections / IP hash /
health checks / LB as a SPOF / recap: "their video cover almost all the concept and you started focusing on the example
... the caching you recently posted what a shit reel i was not able to understand it ... the interviewer and interview
face is not looking it's getting covered with their names ... try some different types of animation ... always be unique"

What went wrong:
- **Caching (Part 3) was confusing even though it had real terms.** It never said what a cache *is* or why it exists
  (fast because it's in memory, the DB is slow) before jumping straight to stale prices, TTL, a race condition between a
  slow request and a delete, versioned writes and request coalescing. That's five advanced ideas with no foundation. It had
  three voices (I, C, N) and two unrelated analogies (mama ji's petrol rate, the class CR).
- **Names covered the faces.** `CallTile`'s chip was a fixed 32px label on a 115px tile (Part 5), so it hid the whole face.
  Fixed in `series/People.tsx`: the chip scales with the tile, sits on the shoulders, and hides the role under 260px.
  The frame check never looked at the faces.
- **Every interview reel looks the same**: two small call tiles under the caption, a row of chip labels, white
  background, objects popping in below. The layout is the same in every episode.

Rules:
1. **Basics before edge cases.** The order is: what it is → why it exists (one real number: Redis ~1 ms vs DB ~50 ms) →
   the standard options by their real names (the list an interviewer expects, e.g. round robin / least connections /
   IP hash) → one failure mode → the trade-off. Advanced twists (races, coalescing) only after the basics are shown, and at most
   one per reel.
2. **A one-screen recap of the must-know terms** near the end (the reference's recap was its most useful part).
3. **Faces are never covered.** The frame check zooms into every person or avatar and confirms the eyes and mouth are visible, with no
   chip, caption or label over them. Call tiles are at least 180px tall; if the scene can't fit that, drop the tiles for that
   beat rather than shrinking them.
4. **Each reel picks a visual idea the last 3 reels didn't use** and writes it in the edit plan: e.g. a whiteboard
   the candidate draws on live, a full-screen architecture diagram the camera moves through, a terminal/dashboard
   (Grafana graph spiking, `curl /health` returning 503), split screen of the interviewer vs the system, a real product screen
   zoomed in, kinetic type on the key term. The call tiles are an option, not the default layout. The gate shows the
   last 3 reels' layouts next to the new style frames: if a viewer couldn't tell them apart, rework.

## 2026-11-06 (night) · Nothing is fixed: experiment from the stats

Sachin: "you are not bind to follow the same design same reference same format you can do whatever you want based on the
views ... you just fetched the stats ... but seems like you are not trying different things ... this reels series is not
working we should change the plan or improve it ... instead of uploading 3 video let's update the 4 video ... do not stick
with one thing".

1. **The rules in this file are a quality floor, not a template.** Format, references, series, slots, length, number of
   reels per day: all can change when the numbers say so.
2. **§0 ends with decisions, not a table:** what isn't working, and 1-3 experiments for today, each with the metric and
   threshold that will prove it (judge at 20h+ next run). Log them in `.claude/instagram/log.md`.
3. **Propose a 4th reel** when there's an important/timely topic or when one kind clearly converts (tools: saves + follows).

## 2026-11-07 · Competitors win on comments; junior wins on depth; sound on every event

Sachin shared 6 fast-growing new accounts and his junior's @systemdesign.bro (numbers in `.claude/instagram/log.md`).

1. **Every free-tool / GitHub reel ends on a comment keyword**: "Comment <WORD>, link DM mein bhejta hoon". One word,
   big on screen in the last 3s, same word in the caption's first line. Auto-DM is set up by Sachin on Instagram.
2. **Reach-lane reels are 35-50s, one tool, 1-2-3 list**, hook with a money stake or an authority twist plus one giant
   number (stars, tokens, ₹ saved). Free thing usable tonight, not news about the tool.
3. **Depth-lane (system design) reels may run 90-150s** and follow the end-to-end spine: everyday hook question →
   one analogy → the real flow → codes / errors / failure points → a twist ("you already did this") → interview tip →
   cheat-sheet recap → comment question → "Next: Part N". They end on "Comment NOTES" for the cheat sheet. Depth
   without a comment ask doesn't reach (junior: 23-39 likes).
4. **Sound design pass is mandatory:** a sound on every visual event (pop, click, tick-tick for counters and timers,
   riser + boom for reveals, paper for cheat sheets, typing for terminals, error buzz), mixed under the voice. Reuse
   `series/studio/public/sfx`; add what's missing rather than leaving an event silent.

## 2026-11-07 (later) · Storytelling rules from Kallaway (two reels Sachin shared)

Source: @kallawaymarketing "Illusion of Novelty" (Db-zJhiuXP3, 21k likes / 6.6k comments) and "Comprehension Maxxing"
(DclT2X8OLZU, 9.2k / 4.2k). Both end on "Comment <WORD>, I'll send you the doc": the same comment engine as the
competitors, used by a storytelling coach.

1. **Illusion of Novelty: every hook makes an old topic feel new.** (a) *New reveal*: something changed ("Raptor 3
   deleted half its plumbing"), never a fact they know. (b) *Contrast framing*: put it against what they believe now
   ("everyone thinks rockets need X; this one doesn't"). (c) *Urgency*: tie it to something that just happened or
   is about to (a launch, a demo, a new release). (d) *Bullseye proof*: one source on screen (study, filing, launch
   footage, repo stars) right after the claim.
2. **Comprehension Maxxing: viewers leave when they stop understanding.** (a) *Visual alignment*: every noun in the VO
   is on screen at that word (cut on the word, highlight the part being named). (b) *Hawkeye narrative*: start broad
   (the whole machine, the whole system, why it matters), then dive to one part. Never open on a detail.
3. Gate check per script: name the reveal, the contrast, the urgency and the proof; tick that each spoken noun has a
   matching visual.

## 2026-11-07 (night) · Flow like the junior: problem → technique; 150 s hard cap; teardowns in light mode, English name

Sachin, after the train-handover script and the Raptor render: "never cross the video more than 150 sec", "remade the
raptor engine in light mode the main things is not visible clearly", "change the name to english", "the script for the
system design was not well curated was not in flow ... check the script of the junior reels", "go step by step ... you
randomly introduce round robin and viewers are thinking from where does round robin comes from ... explain the things
we can solve these issues by these techniques".

Compared against the junior's transcripts (client-server Part 2, DNS outage, browser errors):
1. **Hard cap 150 s** for every reel (overrides "no cap"). Aim 110-140 s for depth episodes.
2. **Every technique enters as the fix to a problem the viewer already feels.** Order per idea: the problem (what goes
   wrong, in the viewer's life) → why it happens → "isko solve karne ke liye ..." → the technique's name → how it fixes
   it. A term with no problem before it is cut. (Our LB reel named round robin cold; the train reel named eNodeB,
   gNodeB, RSRP, A3, X2, jitter buffer, IMS, ping-pong, 700 MHz, debounce: 18 terms in 150 s.)
3. **The junior's spine:** viewer's own action + one question → "Jawab hai: <concept>" in one line → the analogy as a
   full mini story → an explicit mapping line by line ("Ab samjho: tum = client, kitchen = server ...") → back to the
   real example using ONLY the mapped words → signposted steps ("Sabse pehle / Doosra / Teesra / Aakhir mein") → one
   twist from the viewer's own life ("tumne bhi kiya hai") → interview tip → next part asked as the question this part
   leaves open. One example thread end to end; no detours (a proof stat goes inside the step it proves).
4. **Max ~6 new terms per reel**, each said in plain words first.
5. **Teardown series is "What's Inside?"** (English name) and renders the light theme (anatomy `-light.html`) so the
   lit part reads clearly; dark only if the light frame check fails.

## 2026-11-07 (late night) · Floci Part 3: broken sentences, unexplained app, word salad

Sachin on the NotesDrop reel: "'Resume pe AWS console kabhi khola nahi' does this line make sense? ... it should be
resume me AWS hai but kabhi AWS khola nahi", "I even doesn't understand the notes service what does it do", "you are
mixing the word", "your words are not maintaining the flow".

1. **Every line is a full spoken sentence.** No clipped headline Hindi ("Resume pe AWS, console kabhi khola nahi"). Read
   it aloud: if a listener has to fill in a missing verb or subject, rewrite it.
2. **Explain the product before its insides.** For any tool/project reel: what it does, for whom, compared to something
   they already use ("Google Drive ke share link jaisa"), before any service name.
3. **Commands are on screen, never spoken.** `s3 mb`, `put_item`, port numbers, flags go in the code card; the VO says
   what the step does in plain words.
4. **Connect every line to the one before** (toh / kyunki / par / ab / phir). Telegraphic fragments ("Step do. Bucket:
   s3 mb.") are banned.
5. Tool reels follow the same spine as system design: problem -> what the app does -> one analogy story -> explicit
   mapping -> steps in the mapped words -> one mistake -> interview line -> next part. ≤6 spoken terms.

## 2026-11-08 · No blueprint PDF for teardowns

Sachin: "no need to give the blue print pdf remove it" (Ep 2 Roadster already rendered with the PDF line, kept as is:
"no change for today one"). From What's Inside? Ep 3: the comment keyword sends the notes link
(internhack.xyz/notes/<slug>), the VO says "Comment <WORD>, I'll DM you the notes", and no `print.mjs` step.
Also from this run: the reels took ~81% of Sachin's Claude usage and 2h+; keep runs lean (daily-reels SKILL: fast
captions, one contact sheet per reel, lean research briefs, reuse figures from series/anatomy/).

## 2026-11-09 · net-merge (GitHub Pick 4) lost to HowHub's copy of the same tool

Same tool, same 45 s, same "comment SPEED" CTA. HowHub's reel (`Downloads/Video-48757.mp4`) did far better. Diagnosis
from both transcripts and frame sheets:

1. **Hook in the viewer's time and pain, never in a unit.** Ours: "Wi-Fi akela 121 Mbps, saath mein 303" (spec sheet,
   Mbps means nothing to most). Theirs: "Jo movie 2 ghante mein download hoti hai, woh 15 minute mein. Bina Wi-Fi
   upgrade kiye." Convert every number to minutes, rupees or a thing they own before it goes in the first line, and
   kill the obvious objection in the same breath ("bina upgrade", "₹0").
2. **Frame 0 shows the pain big.** Theirs: "2 HOURS WASTED" headline over stuck download cards. Ours: a small caption
   and one thin bar on an empty white screen. The first frame must read with the sound off from across a room.
3. **One big chapter headline per scene** (60-90px, 2-4 words: "DUAL NETWORK MERGE", "2X TO 3X FASTER"). A sound-off
   scroller gets the whole story from headlines alone. No frame with an empty bottom half.
4. **Never undercut the payoff in the voiceover.** Our "Seedhi baat: ek akeli file tez nahi hoti, data kharch hota
   hai" sat right before the CTA. Limits stay honest but go in the caption and pinned comment; the VO instead picks
   use cases where the claim is true (game updates, many downloads at once). Don't copy false claims either: theirs
   ("one movie in 15 min") overstates what net-merge does.
5. **Compare to things the viewer knows or to ₹0.** "Speedify $90/saal" cost 5 s on a product nobody here has heard of.
6. **Straight line:** pain -> name -> what it does -> how (one beat) -> result shown big -> CTA. No mechanism before
   the name, no detours.
7. **Broad stake beats narrow:** "ghar ka Wi-Fi" over "hostel Wi-Fi" unless the reel is truly hostel-only.
8. **The CTA shows what they get:** cards for what lands in the DM (repo, setup guide, tips) plus one follow line.
9. Voice runs on: fewer, longer linked sentences beat eight clipped ones.
