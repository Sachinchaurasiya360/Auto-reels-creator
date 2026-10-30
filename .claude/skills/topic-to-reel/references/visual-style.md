# Visual style: colour, hierarchy, type, layout, motion

The craft target: a one-hue world, cut-out photo collage, surreal metaphors, kinetic type with mixed scale, one idea per screen. Keep those **techniques** in every reel. Choose a new **colour world** for every reel.

## 1. The colour world (one per reel)

A reel lives in one colour world. Its parts, and what each may carry:

| Part | Role | Share of frame |
| --- | --- | --- |
| Ground | Soft radial gradient of one hue: light centre (where the subject sits), deeper at the edges and bottom. A faint grain (2-3%) so it isn't a flat vector fill. | ~60% |
| Ink | A very deep shade of the ground hue (never pure #000 unless the world is greyscale). Every word and every structural line. | ~30% (type + shadows) |
| Photo treatment | Cut-outs in black and white, or duotone (ink → ground light). Props rendered as matte clay/plastic tinted to the ground hue. | subjects |
| Accent | One complementary colour. One word or one object per frame, the thing the eye must find. | ≤10% |
| Interrupt world | The inverse world for the midpoint spike: ink becomes the ground, ground-light becomes the type, accent stays. | one beat |

### Starter worlds

Pick one that fits the topic's emotion, or build a new one with the same parts. **Never reuse the world of either of the last two reels** (check `reels/LOG.md`), so the grid keeps changing while the craft stays recognisable.

| World | Ground (centre → edge) | Ink | Accent | Fits |
| --- | --- | --- | --- | --- |
| Periwinkle | `#ECEBFF` → `#6E6CD6` | `#22236A` | `#FF7A1A` | AI, mind, productivity, future of work |
| Bone & signal red | `#F7EFE8` → `#D9C3B4` | `#1C1414` | `#E11D2E` | hacks, scams, security, crime |
| Cash green | `#EAF4E6` → `#2F7D4F` | `#0F3321` | `#FFD23F` | money, markets, crypto prices, salaries |
| Cobalt print | `#E8EEFA` → `#2050D8` | `#0A1A4A` | `#FF5A36` | science, space, how-it-works |
| Tangerine wire | `#FFF2E4` → `#FF8A3D` | `#2A1405` | `#1F6BFF` | breaking news, launches, announcements |
| Mint lab | `#E7FBF5` → `#15B8A6` | `#06302B` | `#FF4F7B` | health, biotech, food tech |
| Graphite & acid | `#EDEDED` → `#8E8E8E` | `#111111` | `#C6FF00` | chips, hardware, gaming, benchmarks |
| Plum dusk | `#F4E8F6` → `#7B2D8E` | `#2B0A33` | `#FFC93C` | social media, creators, culture |

Check every text colour against the ground behind it: contrast at least 4.5:1 for support/connector text, 3:1 for hero text over 120px. Accent text on the light centre usually fails: give accent words ink outlines or put them on the deeper edge.

Write `style/palette.json`: `{ "world": "...", "ground": [...], "ink": "...", "accent": "...", "interrupt": {...}, "why": "one line on why it fits this topic" }`.

## 2. Hierarchy

Every frame has a reading order decided before layout:

1. **Focal**: one subject, the image or the hero word. 35-55% of the frame height for an image, 60-90% of the width for a hero word.
2. **Support**: one line that adds information.
3. **Connector**: the small glue words of the sentence.

Four things competing means one goes. The eye should land in under 300ms. Squint test: blur the frame, and the focal is still obviously the focal.

## 3. Type

Three tiers, never more on one screen:

| Tier | Size (at 1080 wide) | Face | Use |
| --- | --- | --- | --- |
| Hero | 160-300 px, 1-3 words | condensed bold caps (Latin: Oswald 700, League Gothic, Archivo Black; Devanagari: see `hindi.md`) | the keyword of the phrase |
| Support | 64-100 px | same family, lighter weight or not condensed | the rest of the clause |
| Connector | 34-48 px (never under 28) | light italic | "he was entering a", "are paying", "in empty stadiums" |

- **Mixed scale in one phrase** is the signature: connector words sit tight against the hero, tucked at its top-left or bottom-right corner, baseline-aligned, not floating.
- Tracking: hero -1% to -3%; connectors 0.
- Keyword reveal variety: per-word blur-in (6px → 0, 0.13s); a typewriter reveal that stops mid-word and completes on the next beat (`ACTI…` → `ACTIVELY`), at most twice per reel; a slot-machine roll for numbers.
- Emphasis comes from **scale and weight first**. A coloured keyword in every headline is a known AI-design tell (Hallmark's slop list): use the accent on a word at most 2-3 times per reel, on the words that carry the story's turn, and spend the accent on objects (the one key that fits, the frozen money) the rest of the time.

## 4. Kinetic type is the caption system

Viewers read the captions **or** the graphic, never both. So the words on screen are the captions:

- Each phrase builds word by word on the Scribe word timings (word appears at its start time minus 1 frame).
- The keyword of the phrase is hero size; the rest support or connector size, arranged around the subject.
- A phrase clears at its sentence end or before the next phrase needs the space (exit 0.12-0.2s, blur out).
- Every spoken word appears somewhere (accessibility, muted viewers) except fillers.
- Fallback when a beat's image needs the whole frame (a full receipt screenshot): a single caption line at support size, ink on a ground-coloured band, directly above y=1330. No black chips, no box per group.
- Never stack a caption under a headline that says the same words.

## 5. Layout

- **Safe zones (1080x1920):** words and faces inside y 220-1330 and x 70-940. Below 1330 the app draws its caption, handle and buttons; right of 940 is the like/comment rail.
- **The bottom zone is designed, not empty:** the ground gradient deepens there, subjects' contact shadows and lower parts of props may bleed into it, a floor plane can sit there. Never text.
- **Break the centre stack:** subject roughly centred, but type sits above-left and below-right of it (diagonal reading), or wraps around it. Three elements stacked on the centre line, each centred, is the default look to avoid.
- **Depth, three layers:** ground; subject with a soft contact shadow (blur 30-50px, 25-35% opacity, offset y 20-40px, never a hard offset shadow); foreground props and type. Layers move at different speeds when the camera moves (parallax 1 : 1.15 : 1.35).
- **One idea per screen**, with air: at least 30% of the frame is open ground.

## 6. Imagery

- **Cut-out photo collage** is the default medium: photographic objects, hands and people, background removed, in the world's photo treatment, with soft shadows. Generated per `assets.md`.
- **Generated 3D props**: matte clay or soft plastic, tinted to the ground hue, studio-lit from the upper left. They're for objects that read better clean (a vault, a padlock, a lightbulb).
- **Receipts**: real screenshots presented as physical things (a printed page slightly rotated, a phone in a hand), zoomed into the line that matters, highlighted with the accent, the rest dimmed or blurred.
- **Real logos and real people** come only from official or press sources, credited; never redrawn, never AI-generated.
- **Flat vector graphics** only as accents, one kind per reel: thin orbit rings, arrows, pixel cursors, a hand-drawn underline. Never as the subject of a shot.
- A **signature device** per reel: one recurring visual motif that makes the reel memorable (everything is paperwork in a case file; everything sits on a chessboard; every number is a stack of cash). Decide it in the edit plan.

## 7. Motion

- **Props in:** scale 0.85 → 1 with a spring (damping 0.55-0.7) over 0.3-0.45s, plus a small rotation settle (4° → 0). Out: 40-50% shorter, ease-in.
- **Words in:** blur 6px → 0 and opacity 0 → 1 in 0.13s, on their word timing. Hero words may slam: scale 1.15 → 1 in 0.18s, `expo.out`.
- **Camera:** the whole stage pushes 100 → 104-108% across a held beat (`power1.inOut`); punch-ins are hard cuts to 115-130% on a detail, timed to a stressed word.
- **Accent motion:** one per frame: an orbit ring turning (linear, 20-40°/s), a cursor swarm converging, a small prop orbiting the subject. Never decorative floating, breathing or pulsing loops on titles.
- **Transitions:** 3-5 kinds per reel, each caused by something on screen: match cut on shape, object grows into the next scene, colour flood (the midpoint), carry-across, hard cut on a word. A whip at most once. `/hyperframes` → `references/motion.md` has the measured recipes.
- **Speed contrast:** fast stretches (cuts every 0.8-1.5s) against held beats (2.5-3.5s with only camera motion). Equal speed everywhere reads as generated.

## 8. Banned looks (the slop list)

Each of these has shipped from this skill before and been called out:

- Flat SVG pictograms (laptop, key, vault, server icons) as the hero of a shot.
- Icons inside circles; a progress rail of icons in circles.
- Cards with hard 10-12px offset black shadows on every beat (neo-brutalist template).
- Rubber stamps (`HACKED`, `#1`, `FAKE`) on every reveal. One stamp per reel, if it earns it.
- Hazard/crime-scene tape wipes on every seam.
- Black caption chips with one keyword in yellow.
- Everything centred and stacked; every element fading and sliding up; all elements arriving at once.
- Glitch effects more than once; "HACKED" screens; matrix rain; hooded hacker imagery.
- Pure black or dark navy void with small elements floating in the middle; glow, neon, lens flares; purple-blue gradients when the topic isn't AI; glass cards.
- Emoji as icons; clip-art cash and coins.
- A number shown as a bar chart when one physical object would show its scale.
- From Hallmark's web slop list ([nutlope/hallmark](https://github.com/Nutlope/hallmark)), the ones that carry over to video: a small "eyebrow" label above every headline, tracked-out small-caps labels as decoration, one coloured word in every headline, frames that are only a photo with nothing designed around it.

After every render, name any default that appeared anyway and add it to this list.
