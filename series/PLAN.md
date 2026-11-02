# InternHack daily reels: plan

3 reels a day, Hinglish, one fixed series look, every reel complete on its own.
Decided with Sachin on 2026-10-31.

## 1. Decisions

| Topic | Decision |
| --- | --- |
| Brand | InternHack ([@intern.hack](https://www.instagram.com/intern.hack/), internhack.xyz, tagline "Prepare. Practice. Placed."). Logo: `../InternHack/client/public/logo.png` (black tile, white i, blue H). Fonts and tokens from `../InternHack/client/src/index.css`: Space Grotesk (display), Inter (body), warm off-white ground `#fafaf9`/`#f5f5f4`, ink `#0c0a09`, muted `#57534e`, border `#e7e5e4`; accents: the logo's blue and the site's lime `#a3e635`. |
| Look | One fixed light UI-mockup series look, more detailed than the "Dev Basics" reference. Replaces the per-reel colour world and photo collage for these series. |
| Language | Hinglish voice, Roman-script captions ("UPI ka paisa kahan jaata hai") |
| Voice | Sarvam API (`helpers/sarvam/tts.mjs`, `--lang hi-IN`), keys `sarvam_api_key1` then `sarvam_api_key2` (automatic failover). Cast (confirmed 2026-10-31): narrator for slots A and C `mohit_hi_conversational`; mock interview: interviewer `aditya_hi_conversational`, candidate `advait_hi_character`. **Max 2 voices per reel** (interview = interviewer + candidate, no narrator). **No digits in the TTS script**: spell every number in Devanagari words (2026-11-02, see LESSONS.md). |
| Engine | **Remotion** for the series library and builds (React components with props, and the MIT Remotion libraries in §6 drop straight in). Remotion is free for individuals and teams of up to 3; check remotion.dev/license once InternHack hires beyond that. HyperFrames' local blueprints are used as motion recipes. |
| Images | **None.** No AI image generation, no photos. Everything is drawn UI, diagrams, icons and type. People are initials avatars or icon silhouettes. |
| Daily mix | Same 3 slots every day (§2) |
| Approvals | One gate a day: the 3 topics + 3 scripts together. Then build, render and post copy without stops. |
| Research | Web primary sources + Reddit (public JSON) + Hacker News + GitHub + X via search engine only (`site:x.com`) |
| Length | 45-90s. Completeness beats short. |

## 2. The three daily slots

### Slot A: "Real Life System Design" (Day N)
How an everyday Indian moment works under the hood. One numbered, continuous series.

Seed backlog (from Sachin's list, then extended):
1. Chai stall QR pe UPI: tumhare phone se dukaandaar ke "paisa aa gaya" tak (PSP, NPCI, VPA, bank, soundbox)
2. Tatkal 10 baje: lakhon log ek second mein, IRCTC kaise sambhalta hai (queue, rate limit, waiting room)
3. Honey Singh concert khatam, sab ek saath cab book: Uber surge pricing kaise decide karta hai (geohash, supply/demand)
4. Google Maps road ko laal kaise karta hai (crowdsourced phone location speed)
5. Train mein call nahi kat-ti: cell tower handover
6. Aadhaar: 140 crore logon mein se tumhe ek second mein kaise verify karta hai (biometric dedup, auth API)
7. Zomato New Year's Eve rush: orders spike handle karna (autoscaling, queues)
8. OTP 2 second mein kaise aata hai (SMS gateway, telecom)
9. IPL final pe Hotstar crore log live (CDN, edge)
10. FASTag toll pe gaadi rukti kyon nahi (RFID, NETC)
11. Instagram feed kaise decide karta hai kya dikhana hai
12. WhatsApp "double blue tick" ke peeche kya hota hai

### Slot B: "Mock Interview" series (Episode N)
Two voices: interviewer and candidate. Shape: question, weak answer (interviewer pushes back), pause for the viewer ("tum kya bologe? comment karo"), strong answer explained with visuals, final "interview mein yeh bolo" card.
Topics never repeat a concept already covered (checked by the log, §3). Seed: rate limiter, caching and cache invalidation, load balancer, database index, CAP theorem, idempotency (double payment), message queue, consistent hashing, URL shortener, SQL vs NoSQL, horizontal vs vertical scaling, CDN.
Where natural, an episode can reuse the same real-life setting as a Slot A reel, but it must still explain everything itself.

### Slot C: rotating by weekday
| Day | Type |
| --- | --- |
| Mon, Thu | Tech news, explained (what happened, how it works, what it means for you) |
| Tue, Fri | Trending GitHub repo pick (what it does, a demo, who should use it) |
| Wed, Sat | AI tool or dev tool that saves time, shown working |
| Sun | "Galat samajh rahe ho": a common tech myth, busted |

### Tie-ins with the InternHack product
- `../InternHack/client/src/module/student/learn/system-design/lessons/` has 49 system-design lessons (caching, load balancing, rate limiting, idempotency, Uber, WhatsApp, TinyURL...). Their diagrams and logic are ported into Remotion scenes (they animate on timers, so they're rebuilt frame-driven, not copied), and the reel's pinned comment links the matching lesson.
- Slot B episodes end with "practice this on InternHack mock interview" (the product has a mock-interview module).
- `../InternHack/marketing` already queues daily company and DSA-pattern reel scripts in this repo's `reels/` layout. `topics.py` reads that queue too, so the two pipelines never repeat each other.

## 3. Day-wise log and no repeats

`reels/` is gitignored, so the log and library move to this tracked `series/` folder.

```
series/
  PLAN.md
  log/topics.jsonl      one record per reel (source of truth)
  log/LOG.md            generated, human-readable day-wise view
  backlog.md            ideas not yet made, per slot
  library/CATALOG.md    what's in the scene library (§6)
  studio/               the Remotion project: brand (src/series/brand.ts), our scenes (src/series/),
                        installed libraries (src/components/{remocn,snap-cn,onda}), logo (public/brand/)
```

Record fields: date, slot, series, episode no., slug, title, **concepts covered** (e.g. `rate-limiting`, `upi-psp`), keywords, hook, comment driver used, length, file path, then metrics later (views, watch %, shares, saves, comments).

New helper `helpers/topics.py`:
- `check "<topic>"`: fuzzy match against titles, keywords and concepts. Blocks a repeat, and warns when a concept was already the main subject of another reel.
- `add <record.json>`, `next --slot A` (next episode number), `log` (rebuild `LOG.md`), `backlog --slot B`, `today` (which slot C type).
- Also reads `../InternHack/marketing/queue/*/README.md` (company + DSA pattern per day).
- The two existing reels (Binance, Anthropic IPO) are migrated in as history.

Every topic goes through `check` before research starts, and the record is written after render.

## 4. Research (per reel)

1. Primary sources first: NPCI, UIDAI, IRCTC/CRIS, TRAI, company engineering blogs (Uber, Zomato, Swiggy, Google, Hotstar), papers, official docs.
2. Reddit: r/developersIndia, r/india, r/IndiaTech, r/cscareerquestionsIN, r/systemdesign, r/ExperiencedDevs. Reddit blocks anonymous scripts, so the helper uses Reddit's official API when `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` are in `.env` (free "script" app at reddit.com/prefs/apps); without them it prints `site:reddit.com` queries for web search. Pull what people get wrong or keep asking. Those become hooks and comment drivers.
3. X: `site:x.com <topic>` searches, read what loads, credit handles.
4. Hacker News (Algolia API) and GitHub (trending page, `gh api` search) for Slot C and for tech depth.
5. Interview topics: LeetCode Discuss, Reddit interview threads, Glassdoor snippets for the questions actually asked.

`helpers/research.py` (`reddit`, `hn`, `github trending|search`, `x`, `all -o <file>`) writes a "What people say" section with links. The 3 reels of a day are researched in parallel by 3 subagents.

## 5. Script rules

- **Complete on its own:** the viewer needs no other video. Every reel covers: the everyday moment, why it's hard (with a real number), how it works step by step, one edge case or failure, and a one-line takeaway. Every term is defined the first time it's used. Never "pichli video mein".
- Hinglish the way Indian dev creators talk. Story, not a lecture. No spoken "step one".
- Hook in under 3s with a concrete scene ("Chai waale ko tumne 10 rupay bheje...").
- **Engagement:** exactly one designed comment driver per reel, rotated and logged so it doesn't feel templated:
  - A/B question ("UPI ya card, tum kya use karte ho?")
  - Pause-and-guess before the reveal (interview series default)
  - "Is dost ko tag karo jo Tatkal mein hamesha fail hota hai"
  - "Save karo, interview se pehle kaam aayega"
  - Next-topic vote ("agla: Uber surge ya Google Maps? comment karo")
  It's also on screen as a designed card, and goes into the pinned comment.
- The end card: InternHack follow + series progress.

## 6. Shared scene library (`series/library/`)

Each scene is a Remotion React component with typed props, in one shared Remotion project (`series/studio/`), with a Studio preview and a reference still. Each reel is a composition in that project (props + its VO and word timings), so scenes are imported, not copied. `series/library/CATALOG.md` lists all of them. A reel picks scenes, sets variables, and writes only the scenes unique to it.

v1 set (built while making the pilot reels, not up front):

| Group | Scenes |
| --- | --- |
| Frame | series badge + day progress, kinetic Hinglish caption track (promoted from the reels' `tools/make_captions.py`), end follow card, comment-driver card |
| Devices | phone (Android/iOS frame, status bar) with screens: UPI pay, payment success + soundbox, incoming call, contacts, app queue/waiting room, notification toast, map view |
| Web and code | browser window, code editor (typing, line highlight, key/value badges), terminal, JSON request/response card |
| System | server node, database, cache, load balancer, message queue (items sliding), network edge with packets moving along it, request flood (thousands of dots), cell tower with signal and handover, counter/odometer for live numbers |
| People and receipts | initials avatar row, chat bubbles (interviewer/candidate), interview answer card, news headline receipt, tweet card, Reddit post card, GitHub repo card (stars, language, README peek) |
| Map | city map with route and traffic colouring (green → red), surge hexagons |

**Detail bar (beyond the reference):** at least 3 depth layers per scene, a micro-interaction at least every 1.2s (finger tap, toast, counter tick, packet arriving), real-looking data (real VPA formats, real IRCTC times, real numbers from research), camera push and punch-ins on the detail that matters, and a distinct SFX per kind of interaction from `reels/_library/sfx`.

**Ready-made material, used before hand-building** (all checked on GitHub 2026-10-31):

| Source | Licence | What we take |
| --- | --- | --- |
| [Remocn/remocn](https://github.com/Remocn/remocn) (★1.6k, active) | MIT | 100+ animated icons (phone, database, server-ish, wallet, shield, users, zap...), UI flows (chat-flow, imessage-chat-flow, checkout-flow, ai-prompt-flow, command menu, cursor), text effects, transitions, backgrounds |
| [shadcn-labs/snapcn](https://github.com/shadcn-labs/snapcn) (★548) | MIT | device frames, terminal sessions, AI chat streams, captions, text reveals |
| [degueba/onda](https://github.com/degueba/onda) | MIT | motion graphics components + 18 `<TransitionSeries>` transitions |
| [Curvable/motion](https://github.com/Curvable/motion) | MIT | 14 launch-video scenes (typewriter, reveals) |
| [stefanwittwer/remotion-animated](https://github.com/stefanwittwer/remotion-animated) | MIT | `<Animated>` helper for quick moves |
| [diffusionstudio/lottie](https://github.com/diffusionstudio/lottie) (★5.6k) | MIT | generate Lottie animations with Claude; play with `@remotion/lottie` |
| `@remotion/transitions`, `@remotion/lottie`, `@remotion/paths`, `@remotion/shapes` | Remotion | official transitions, Lottie playback, SVG path progress (packets along links) |
| HyperFrames local: `~/.claude/skills/hyperframes-animation/` (22 blueprints, 13 example scenes, rules, transitions) | local | choreography recipes: device-surface-showcase, constellation-hub, dataviz-countup, overwhelm-surround, cursor-ui-demo, spatial-pan-stations... ported to Remotion |
| [reactvideoeditor/remotion-templates](https://github.com/reactvideoeditor/remotion-templates) (81 templates) | no licence file | ideas only, don't copy code |

Remocn and snapcn install with the shadcn CLI as source we own, so they get restyled to the series brand.

New helper `helpers/new_reel.py <slot> <slug>`: creates the reel's working folder `reels/<date>-<slug>/` and registers a composition for it in `series/studio/` with the VO, word timings and SFX wired in.

## 7. Daily run

0. Read `series/LESSONS.md` (verdicts on past reels and the rules they produced). The edit plan must satisfy every rule there.
1. `topics.py backlog` → pick 3 (A, B, C for today's weekday) → `topics.py check` each.
2. Research ×3 in parallel → `research.md` each.
3. Hooks + scripts ×3 → **daily gate** (one message: 3 hooks, 3 scripts, comment drivers).
4. Sarvam VO (2 voices for B) → local word timings (`transcribe_local.py`, no ElevenLabs) → caption fixes.
5. Edit plan → style-frame stills of hook / midpoint / payoff compared with `reelsdownloader-video-1.mp4` → build the composition from library scenes → still frames review (anti-slop) → `npx remotion render` → loudness.
6. Post copy (`/ig-caption`, YouTube title/description, pinned comment) → `topics.py add` → deliver all 3.
7. Weekly: enter metrics, `/ig-audit` every ~10 reels, reorder backlog by what's working.

## 8. Build order

| Phase | Work | Done when |
| --- | --- | --- |
| P0 ✅ 2026-10-31 | `series/` folder, Remotion project `series/studio/` with Remocn + snapcn + onda installed, brand tokens + badge, `topics.py`, migrate the 2 existing reels, seed backlog, research helpers | `topics.py check "UPI"` works, a demo of installed components renders |
| P1 | Pilot Slot A: UPI chai stall. First: a vertical stage wrapper so 16:9 library components fit 1080x1920 (see CATALOG known gap). Then the phone, system and packet scenes and the word-timed Hinglish captions | Reel approved, scenes in `CATALOG.md` |
| P2 | Pilot Slot B: rate limiter mock interview, 2 voices. Adds chat bubbles and answer card | Reel approved |
| P3 | Pilot Slot C: GitHub repo pick. Adds repo, tweet, Reddit and headline cards | Reel approved |
| P4 | Update `topic-to-reel` with a "series mode" (Remotion, fixed look, library first, no images, completeness check, comment driver), and add a `daily-reels` skill that runs §7 for 3 reels (skill added 2026-10-31: `.claude/skills/daily-reels/`) | One full day of 3 run end to end |
| P5 | Steady state: 3 a day, library grows only when a reel needs a new scene | |

## 9. Still needed from Sachin

- Optional: a free Reddit "script" app (reddit.com/prefs/apps) and `REDDIT_CLIENT_ID` / `REDDIT_CLIENT_SECRET` in `.env`, for full Reddit threads with comments. Without it, Reddit is read through web search.
- YouTube handle, if there's a channel.
