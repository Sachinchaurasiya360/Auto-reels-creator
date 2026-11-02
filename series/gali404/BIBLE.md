# Gali No. 404: series bible + pilot plan

Status: plan for Sachin's review (2026-11-02). Nothing built yet.
Reference: `Video-70090.mp4` ("Greenfield Sanctuary", 2:27, 720x1280).

---

## 1. What the reference does well (and what we take from it)

Not copying the story, the look of the characters, or the setting. We're taking the craft.

| Craft move | How Greenfield does it | Rule for us |
| --- | --- | --- |
| **One-line premise that's an inversion** | "2041. The last place where humans still write code by hand." A retirement home for hand-coders. You get it in 3 seconds and it's already a joke. | Our premise fits in one title card and turns something ordinary upside down. |
| **Outsider as the audience's stand-in** | The Visitor (hoodie, phone, "forty agents running") gets the tour. We learn the world through his questions. | Every episode has a newcomer who asks what the viewer would ask. |
| **Every joke is a real ritual, bent** | Stand-up: "Renamed a variable. Tomorrow I'll rename it back. No blockers." Review: "Reading it slowly. With love." Shipping: "Once a quarter. We have cake." | Every gag is a real system-design mechanism acted out as Indian daily life. The joke *is* the explanation. |
| **Characters you can read in one look** | Each one has a costume colour, one prop and one attitude: Nurse (sage scrubs, lanyard, dry wit), Gerald (yellow sweater, round glasses, lit by the CRT), the Agent (a purple tablet that never stops talking). | One silhouette, one prop, one colour, one verbal tic each. The speaker chip uses the character's costume colour. |
| **Colour carries the theme** | The sanctuary is warm: terracotta, sage, cream, wood. The cold blue/purple appears only on phones and the agent tablet, the outside world getting in. | Warm = the system is healthy. Cold violet/blue = errors, bots, timeouts, the outside. Never use cold colours just for decoration. |
| **Time carries the arc** | The phone reads 16:42 on arrival and 19:58 on departure; the exterior goes from day to dusk; the wall clock is always visible. | Our clock is the request's time budget (see §3, "the sky is the SLA"). |
| **The set tells the story** | Corkboard notes "stand-up 9:00", "cake day Q4", "no agents past here"; the drop box for phones; "please leave phones & agents here ♥". | Every wall has a sign or poster that's a joke or a rule of the world. Nothing generic in the background. |
| **Emotional beat under the satire** | Gerald: "One test. I wrote it myself. I know why it passes." The Visitor: "I want to stay here." Nurse: "There's a waiting list. Eight years." | Each episode gets one sincere line, said seriously once, in the middle of the jokes. |
| **Bookends + a sting** | Opens and closes on the same exterior with the same title card. Last beat: "While you were away, your agents shipped 312 features." / "...Right." | The last shot rhymes with the first, and the last line is the best punchline (already a LESSONS rule). |
| **Simple film grammar, used properly** | Wide shot → over the shoulder → close-ups going back and forth → an insert (phone, cake, CRT, the hand dropping the phone) → wide again. One line of dialogue per shot, shots of 2-5s. | The same grammar. Inserts are where the system-design mechanism shows on screen (LESSONS rule 3: cause → effect). |
| **Finish** | Toy-like 3D (spheres, capsules, matte clay), soft warm key light, bloom on the bulbs, dust in the air, shallow depth of field, serif subtitle cards with a small coloured name tag. | Same level of finish, in our own palette and type (§5). |

---

## 2. The premise

> **Gali No. 404** — *jahan tumhara internet rehta hai.*
> Every time you tap a button on your phone, a tiny courier runs out of the screen into a crowded Indian lane.
> Everyone who lives there is a piece of the system. They have **two seconds** to get your order done.

Why this premise and not a "future of coding" satire like the reference:

- **It's how InternHack already teaches.** Every episode is one system-design concept (load balancer, DNS, queue,
  index...), so the story series feeds the Mock Interview and Real Life System Design slots and links to the
  matching lesson on InternHack. The story is the explanation, not decoration on top of it.
- **It's the viewer's own day** (LESSONS 2026-11-01 rule 4): sale nights, chai counters, ration-shop tokens,
  the colony guard's register, the gossipy aunty who knows everyone's address.
- **The name is a dev joke** that students will get: the lane nobody can find.
- **It can run for a long time.** One lane, one cast, a new resident or problem each episode.

---

## 3. The rules of the world (keep these consistent)

1. **Everything in an episode happens inside one tap.** The story takes 70s; in the real world it took under
   two seconds. The opening and closing shots are the real-world phone.
2. **The sky is the SLA.** At 0 ms the lane is in golden late-afternoon light. As the request takes longer,
   the sky moves to dusk. Close to the timeout, cold violet comes in from the edges of the frame. If a request
   is fast, the sun stays up. The viewer feels the latency before anyone mentions it.
3. **The clock tower** at the mouth of the lane shows milliseconds, not hours (`0.000` → `2.000`). It's the
   world's only clock and appears in every establishing shot.
4. **Requests are people, never dots** (LESSONS rule 7). A traffic spike is a crowd of couriers all looking like
   the hero, each with their own number on their cap.
5. **Warm vs cold** (§5): warm materials belong to the lane. Cold violet means the outside or a failure: bots,
   dead servers, timeouts, the phone screen.
6. **Signs are the world's rulebook.** Every rule a character explains is also painted on a wall somewhere,
   e.g. "TTL 60 SECOND. USKE BAAD PHIR SE POOCHO." — Cache Chachi.
7. **Responses are stamps.** Every completed request gets a physical stamp on the courier's envelope
   (`CONFIRMED`, `NOT FOUND`, `429 — KAL AANA`). The insert of the stamp coming down is the cause → effect beat.

---

## 4. The cast

Each episode is a **two-hander**: Pinku plus that episode's resident. That keeps us inside the **2-voice limit**
(LESSONS 2026-11-02). Everyone else appears without lines and comes across through props, signs and their
signature sound.

| Character | Is | Look (silhouette · prop · colour) | Voice / tic | Signature sound |
| --- | --- | --- | --- | --- |
| **Pinku** | The request. The hero of every episode. | Small and round, khaki courier uniform, cap with a stitched request number (the episode number), sealed envelope held to his chest. **Haldi yellow** `#E3A72F` | Eager, out of breath, wants to impress. "Bas do second hain!" | Running footsteps, the satchel buckle |
| **Warden Bhaiya** | Load balancer | Big, on a plastic chair at the crossing, reflective vest, whistle, a glass of cutting chai that's never empty. **Sage** `#7E9C74` | Unbothered, has seen every sale night. Counts "ek, do, teen... ek." | The whistle |
| **Cache Chachi** | Cache / DNS | Looks out from a first-floor window, curlers in her hair, a kitchen timer on a string round her neck. **Rose** `#D9778A` | Knows everyone's address, forgets after 60s. "Arre, abhi toh bataya tha!" | The timer ticking, then its ding |
| **Queue Didi** | Message queue | At a ration-shop-style token window, token roll, rubber stamp, reading glasses. **Peacock teal** `#2F7F7A` | Strictly fair, not moved by drama. "Token lo. Baitho." | Token beep + the number display flipping |
| **Guard Gupta** | Auth / gate pass | Colony gate, register with a pen tied to it on a string, moustache, beret. **Terracotta** `#B85C38` | Suspicious of everyone. "Naam? Kisse milna hai? Pass dikhao." | The register slamming shut |
| **Dadaji** | Database / source of truth | Haveli at the far end of the lane, bahi-khata ledger, quill pen, the one light that's always on. **Maroon** `#7A2E3A` | Slow, never wrong. "Likha hai toh hua hai. Nahi likha, toh nahi hua." | The ledger stamp thudding |
| **Server Bhai 1 / 2 / 3...** | App servers | Identical brothers in vests behind identical chai counters, each counter numbered. Neutral cream. | No lines. Snoring when down. | Glasses clinking, a shutter rolling |
| **The Bot Gang** | Season villain: bots, scalpers | Faceless, glossy, **cold violet** `#6C5CE7`. The only shiny material in the world. | No lines. A synth glitch. | A digital chirp |

**Running threads that tie the season together** (the reference's "everything feels connected"):
- Pinku's cap number goes up each episode (#401, #402, #403, then it jumps to #405). The finale reveals what happened to #404.
- Dadaji's haveli light glows in the background of every episode's wide shot. Nobody mentions it until Ep 5.
- Cache Chachi shouts something from her window in every episode, wrong half the time.
- The Bot Gang shows up for one frame per episode, in the cold violet corner of a wide shot, before the finale.
- Every episode ends at the same chai counter, the same way: Warden's whistle.

---

## 5. Visual bible

**Look:** toy-like 3D like the reference: heads are spheres, bodies capsules, everything matte clay
(roughness ≈ 0.8). Our own setting, palette, type and faces.

**Palette** (warm = the lane, cold = the outside):

| Role | Colour |
| --- | --- |
| Lime-washed walls | `#F1E6D2` |
| Terracotta trim / roofs | `#C8643B` |
| Wood, doors, chairs | `#6B4130` |
| String lights, bulbs (bloom) | `#FFD58A` |
| Sky at 0 ms → dusk | `#F6C98B` → `#E58B5A` → `#5A3E66` |
| **Cold (errors / bots / screens only)** | `#6C5CE7`, `#4B5BD6` |
| Character colours | §4 |

**Set:** a narrow lane one storey high, tangled overhead wires (literally the network), marigold strings for the
Diwali pilot, shop boards with tech puns ("Shree Ganesh Round Robin Chai Centre", "Sharma Hashing Works",
"Yahan Retry Mat Karo"), the clock tower at the mouth of the lane, Dadaji's haveli at the far end.

**Light:** one warm key (low sun), a sky-blue fill through a hemisphere light that turns violet as time runs out, bloom on
bulbs and the phone screen, floating dust motes, shallow depth of field on close-ups.

**Type:** our brand, not the reference's serif. Title in Space Grotesk; subtitles are cream cards with Inter
text, in the same position on every shot, with a small chip in the character's colour ("PINKU", "WARDEN
BHAIYA"). Extend `Captions.tsx` with a `story` variant; don't build a new one.

**Camera grammar:** establishing wide (clock tower in frame) → follow behind Pinku → close-ups going back and
forth at eye level → **mechanism insert** (whistle → courier peeling off to a counter → stamp) → wide again.
One line per shot, shots of 2-5s, a punch-in at least every ~10s (LESSONS motion floor).

**Sound:** a lane bed (a pressure cooker far off, a bike horn, steel glasses), each character's signature sound
(§4), VO dialogue on top. Clean, at the editor's levels from the topic-to-reel skill.

---

## 6. Pilot · Ep 1 "Diwali Sale, 11:59 PM" (load balancing)

Concept check: `load-balancing`, `health-check`, `autoscaling` are not in `topics.jsonl` yet.
Timing: Diwali is **Sun 8 Nov 2026**, so the sale-night episode works if it ships by then.
Two voices: Pinku (`advait_hi_character`) + Warden Bhaiya (`aditya_hi_conversational`). ~72s.
TTS script gets every number spelled out in Devanagari (LESSONS rule).

| # | Time | Shot | Line (caption) | What it shows |
| --- | --- | --- | --- | --- |
| 1 | 0-4 | Insert: a thumb over the "BUY NOW" button, sale countdown `00:00:03`. Tap. Push into the glowing screen. | — | Real-world bookend. Clock tower `0.000`. |
| 2 | 4-7 | Wide: Pinku shoots out of a pipe into the lane at golden hour, marigolds, title card **GALI No. 404**. | PINKU: "Bhaiya! Bhaiya! iPhone, ₹9,999 wala — bas do second hain!" | Hook. Opens the loop: will he make it in 2s? |
| 3 | 7-11 | Close-up of Warden, sipping chai, not looking up. Then tilt up: the lane is packed with identical Pinkus. | WARDEN: "Tu akela nahi hai, beta." | The crowd = a traffic spike, shown as people. Punchline. |
| 4 | 11-20 | Whistle. Insert: three counters, Server Bhai 1/2/3. Warden points: one, two, three. | WARDEN: "Ek, do, teen. Ek, do, teen. Main bas bataata hoon kaun kahan jaaye." | Round robin, cause → effect: each courier peels off to a counter. |
| 5 | 20-24 | Pinku gets sent to counter 2. Push in: the shutter's half down, Server Bhai 2 snoring. Couriers piling up, cold violet at that corner. | PINKU: "Bhaiya, yeh toh so raha hai!" | Re-hook / twist. |
| 6 | 24-34 | Warden taps the shutter with his stick: "Zinda hai?" Nothing. He chalks a cross on it and turns the line to 1 and 3. | WARDEN: "Har paanch second mein poochta hoon — zinda hai? Jawab nahi diya, toh list se naam kaat. Rishtedaaron jaisa." | Health check. Humour beat 1. |
| 7 | 34-42 | Clock tower jumps to `1.200`, sky goes to dusk. The crowd doubles. | PINKU: "Do counter, lakhon log... hum toh gaye." | Escalation; you can see the time budget in the sky. |
| 8 | 42-52 | Warden pulls a rope / makes one call. Wide: shutters roll up all down the lane, counters 4...20, string lights coming on one after another. | WARDEN: "Bheed badhi, dukaan badhao. Bheed gayi, band karo. Bill bhi kam aata hai." | Autoscaling, the visual high point. Humour beat 2. |
| 9 | 52-58 | Pinku runs to counter 7. Insert: the stamp comes down — `CONFIRMED`. The sky warms up a little. | — | Response = stamp. Mechanism closed. |
| 10 | 58-63 | Close-up of Warden, chai again. The quiet line. | WARDEN: "Log sochte hain sale fast tha. Kisi ko seeti sunai nahi deti." | The sincere beat. Then the name: caption chip **Load Balancer**. |
| 11 | 63-67 | Insert, real world: the phone reads "Order placed ✓ · 1.8s". | — | Closes the loop from the hook. |
| 12 | 67-72 | Back in the lane: Pinku's back out of the pipe, cap now **#402**, same run as shot 2. | PINKU: "Bhaiya! Bhaiya! ...cancel karna hai." · Warden sighs. Whistle. | Last line = best punchline, loops back to the hook. |

Comment driver (on an end card + pinned comment): *"Is Diwali sale mein tumhare cart mein kya pada hai? Comment karo."*
Pinned comment links InternHack's load-balancing lesson.

---

## 7. Season 1 outline (6 episodes, one a week)

| Ep | Cap # | Resident | Concept | The bit |
| --- | --- | --- | --- | --- |
| 1 | 401 | Warden Bhaiya | Load balancing, health check, autoscaling | Diwali sale night (above) |
| 2 | 402 | Cache Chachi | DNS + TTL | Pinku has to find "instagram.com ka ghar"; Chachi knows every address, but only for 60 seconds |
| 3 | 403 | Queue Didi | Message queue | 31 Dec, 11:59 PM, everyone orders biryani; the token window keeps the kitchen from collapsing |
| 4 | **405** (404 skipped: "404 kahan gaya?" becomes a running mystery) | Guard Gupta | Auth tokens (gate pass / JWT) | Pinku loses his gate pass; "pass dikhao" every time |
| 5 | 406 | Dadaji | Database index | Dadaji finds a record in 13 lakh pages instantly — the index at the back of the bahi-khata. The haveli light gets its reveal. |
| 6 | **404** | Full cast vs the Bot Gang | Bot detection / CAPTCHA (Tatkal 10 AM) | The cold violet finally takes over the lane; every resident's mechanism together; Pinku teaches a new request |

The finale answers the cap-number mystery: request #404 is the one that never arrived, the one the bots
blocked. The Ep 6 concept gets checked with `topics.py check` before they're scripted
(rate limiting has already been done, so the finale leans on bot detection).

---

## 8. Production plan

**Engine:** stays Remotion (series/studio). Adds the 3D stack:
`three`, `@remotion/three` (ThreeCanvas), `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`.
Everything is driven by `useCurrentFrame()` (no `useFrame`, no clocks) so renders are deterministic. Render on
the GPU per memory (`--gl=angle`, concurrency 10). No AI images: every model is built from primitives in code,
in line with PLAN.md's "no images" rule.

**New library pieces** (in `src/series/three/`, added to `CATALOG.md`, reused every episode):

| Piece | What it does |
| --- | --- |
| `Toy` | Character from params: skin, hair, outfit colour, accessory, prop slot. Blinks (seeded), breathes when idle, poses from presets, procedural walk/run cycle. |
| `Mouth` | Mouth opens and closes from the VO's loudness envelope per speaker (a small helper precomputes per-frame values from the Sarvam WAV). |
| `Crowd` | Instanced Pinkus with a cap number, offset walk cycles, a count that can be animated (a traffic spike). |
| `LaneSet` | The lane as modular pieces: house front, counter + shutter, clock tower, wires, sign boards that take a text prop, marigold strings. |
| `SkyRig` | Maps the "ms elapsed" prop to the sun, sky colour and how much cold violet comes in (§3 rule 2). |
| `ShotCam` | Camera presets (wide, OTS, CU, insert) with eased dolly and punch-in; each shot is a list of keyframes. |
| `Stamp`, `Whistle`, `Timer`... | Props for the mechanism inserts. |
| `Captions` `story` variant | Speaker chip in the character's colour (extends the existing component). |

**Order of work, with a gate at each step:**

1. **Spike (½ day):** one `Toy` + one counter + bloom + depth of field, 3s at 1080x1920 on the GPU. Measure seconds per
   frame. If a 72s episode takes more than ~40 min to render, simplify the post-processing before going further.
2. **Style frames (1 day):** three stills — shot 3 (the crowd reveal), shot 6 (Warden close-up) and shot 8 (the
   shutters) — side by side with frames from `Video-70090.mp4`. **Gate: Sachin approves the look.**
   If ours has less detail, rework before building anything else (LESSONS rule 8).
3. **Script + VO (½ day):** the final Hinglish lines, two Sarvam voices, numbers listen-checked, word timings.
4. **Animatic (1 day):** grey blocking with the real VO and cameras, no lighting. **Gate: timing and jokes land.**
5. **Full build + sound (1½ days):** lighting, sky rig, inserts, SFX, captions. Review frames, render, loudness.
6. **Post copy + log** as usual (`/ig-caption`, `topics.py add`).

That's about 4½ days for the pilot, most of it building the library once. Later episodes reuse it and should take
about 1½-2 days each. To make Diwali (Sun 8 Nov) the pilot has to start tomorrow; if the gates slip, the sale
story still works for any sale night, and Ep 2 (DNS) can go first.

---

## 9. Decisions for Sachin

1. **Concept:** go with *Gali No. 404*?
2. **Cadence:** a weekly flagship on top of the 3 daily reels (recommended), or does it replace a daily slot one day a week?
3. **3D stack:** OK to add three.js + react-three-fiber to `series/studio`? (It's a new kind of build for the series.)
4. **Voices:** keep the 2-voice limit with two-handers (recommended; it also suits the format), or allow one
   more voice for the ensemble finale?
5. **Length:** the pilot is ~72s, inside the 60-80s rule. The reference runs 2:27; do we want one longer
   "special" for the finale?
