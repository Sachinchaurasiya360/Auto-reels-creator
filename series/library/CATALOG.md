# Scene library catalog

Everything lives in the Remotion project `series/studio/`. Import with `@/components/...` or `@/series/...`.
Third-party components are copied source (MIT): restyle freely, keep the folder they came in.

Add more from the same registries:

```bash
cd series/studio
npx shadcn@latest add https://www.remocn.dev/r/<name>.json     # 438 items: https://remocn.dev
npx shadcn@latest add https://snapcn.dev/r/<name>.json         # 108 items: https://snapcn.dev
```

onda (`https://remotion.onda.video/r/<name>.json`, 88 items) lists its helpers without a registry
prefix, which shadcn can't resolve: download the item JSON, write each `files[].content` to
`src/<target>`, and point `../../../lib/<x>` imports at `lib/onda/<x>`. Helpers are in `src/lib/onda/`.

**Known gap:** most library components are designed for 16:9. In 1080x1920 they come out small or
off-centre (checked 2026-10-31 on node-graph, imessage-chat-flow, terminal-simulator). Wrap them in a
vertical stage that scales and places them before using them in a reel. That wrapper is the first
library task of the pilot reel.

## Rule: reuse first, improve, then build (Sachin, 2026-11-02)

Before writing any scene, search this catalog and `src/series/*` (and Remocn / snapcn / onda below) for
what already exists. If something is close, **improve that component** (a new prop, a variant) instead of
drawing a new one inside the reel. Build new only when nothing fits, and build it in `src/series/` from the
existing pieces, then add it here. No helper gets copy-pasted between reels: if two reels need it, it
belongs in the library.

## Series (ours) — `src/series/`

| Scene | What it is |
| --- | --- |
| `brand.ts` | InternHack tokens, fonts (Space Grotesk / Inter / JetBrains Mono), safe area, shared theme for Remocn + snapcn |
| `SeriesFrame` | warm off-white ground, drifting dot grid, series badge (logo + series name + Day/Ep), handle; wraps the Remocn and snapcn theme providers |
| `CommentPrompt` | the comment-driver card: question, two answer chips, reply box typing an answer |
| `FollowCard` | InternHack profile card, tap on Follow flips to Following |
| `demo/SeriesKitDemo` | smoke test of the kit (not a reel) |
| `Phone` | modern Android phone drawn at native size; children = screen (`PHONE_SCREEN` gives its size) |
| `Props` | `QRCode`, `Soundbox`, `Counter`, `StrikeChip`, `InfoCard`, `BankGlyph` |
| `System` | `SysNode` (party box) and `Link` (curved link that draws on and carries packets) |
| `Stage` | puts a 16:9 library component into the vertical frame |
| `Road` (2026-11-01) | side-view `Car` (FASTag sticker on the windshield, `tagGlow`, `wheelTurn`), `TollGantry` (lane sign + RFID reader, `waves`), `BoomBarrier` (`angle` -80 = open), `Road`, `FastagSticker` close-up |
| `People` (2026-11-01) | drawn bust `Person` (`looks.interviewer/candidate/student/mom`, `talk`, `mood`), video-call `CallTile`, `CallPair` (interviewer + candidate, speaking ring) |
| `Devices` (2026-11-01) | `Laptop` (screen = children), `Router`, `CellTower`, `IncognitoGlyph` |
| `Motion` (2026-11-01) | `Punch` (punch-in toward a point, optional back-out), `ColorWipe` (colour flood hiding a cut, reel level), `Travel` (object A -> B, optional arc), `Pill` |
| `Sms` (2026-11-01) | bank SMS / notification card for inside `Phone` |
| `Calls` (2026-11-02) | `IncomingCall` screen for inside `Phone dark`: network-shown name (CNAP), number, sub line, pulsing avatar (`ring`) |
| `Lift` (2026-11-02) | building lift from the lobby: floor display, sliding steel doors (`open` 0-1), cabin children |
| `Layout` (2026-11-02) | `Bleed` (fade below the platform-UI line, for tall phones), `Pop` (placed element that scales in with `usePop`) |
| `Infra` (2026-11-02) | `Db` (SVG cylinder: `size`, `glow`, `shake`), `Server` (dark panel + status dot), `Store` (one cached/stored value card, `glow`), `Envelope` (a message as an envelope), `Stamp` (rubber stamp slam), `Bubble` (speech bubble) |
| `People.CaptionCall` (2026-11-02) | Arjun + Priya call strip whose speaking ring follows the captions at reel-time `t` |
| `Kit` (2026-11-02) | brand-styled wrappers over the third-party pieces that passed the vertical trial: `CodeBeat` (Remocn code-morph: light IDE, line numbers, code morphs between versions; crop computed from the panel), `InterviewChat` (Remocn iMessage thread, Arjun/Priya; `interviewChatSeconds`), `BigNumber` (odometer roll, holds the end value), `Annotate` (hand-drawn ink arrow between frame points), `Verdict` (word slams in with dust: DROP / 429 / DECLINED), `BeforeAfter` (onda split screen, stacked), `Emphasis` (onda underline). Also `Band`, `BAND`, `brandVars` to place any onda/Remocn component in the content band |
| `Atm` (2026-11-03) | `Atm` machine (bank hood, screen = `screen` node, keypad, card slot, cash slot; `cash` 0-1 pushes notes out, `stuck` jams them with a red slot light), `Note` (₹500 note) |
| `Calendar` (2026-11-03) | `DayGrid`: day boxes that light up one by one (`lit`), red from `warnFrom` (T+5 rules, exposure windows), `tag(i)` labels a box |
| `Data` (2026-11-03) | `RowScan` (table read row by row: `scan` 0-1 moves the read head, `hit` marks the match), `IndexTree` (B-tree levels, `path` lit `lit` levels deep) |
| `Sky` (2026-11-03) | `Satellite` (solar wings + its onboard `ClockFace`, `dead`, `glow`), `ClockFace`, `MapDot` (street map + blue location dot, `halo`, `lost`), `RangeRing` (a satellite's distance circle, `draw` 0-1) |
| `Press` (2026-11-03) | news-reel proof in the Hyderabad-reference style: `SerifTitle` (Instrument Serif + italic sub line), `SourceCard` (source page; wrap the quote in `Marked`), `XPost`, `Marked` (black marker sweep, `hl` 0-1). `fonts.serif` added to `brand.ts` |
| `CommentPrompt` (improved 2026-11-03) | now takes 2 or 3 options (chips wrap) |
| `Story` (2026-11-04) | the one-scene story pattern (LESSONS 2026-11-03): `SceneLabel` ("// dakghar"), `Legend` (concept chips that accumulate, newest ringed), `Camera` (zoom/pan keyframes over one scene, `anchor` keeps zooms in the content band), `HeaderBand` (ground band behind badge/captions/legend), `Moment` (pop in/out between two reel-times), `usePopAt`. Use as direct children of `Reel`, no Beats |
| `Reel.followLine` / `SeriesBadge` (improved 2026-11-04) | follow card reason line names the next part; badge reads "Part N" for every series |
| `People.looks.dakiya` (2026-11-04) | khaki postman / counter-uncle bust |
| `Traffic` (2026-11-05) | live-traffic pieces: `TrafficRoad` (top-down road cut into tukde, each coloured by speed ratio with Google's 4 levels, phones riding along with km/h tags, `highlight`), `MapLine` (route line in a phone map with per-stretch traffic colours), `PhoneCart` (thela full of phones, Weckert Berlin), `PhoneGlyph`, `levelFor`, `trafficColors` |
| `Ring` (2026-11-05) | consistent-hashing scene: `HashRing` (gol ring road, numbered houses tagged in the owner's colour, delivery boys as `Person` busts, extra spots = virtual-node markers, owner arcs, `moved` houses ringed red; `rule` "modulo" or "ring"), `ringOwner`, `ringPoint` |
| `Embed` (2026-11-05) | embeddings scene: `NumberSpace` ("number duniya" scatter of file pieces, query pin with dashed links to nearest), `VectorStrip` ("[0.12, -0.41, … ×768]" typing in), `PieceChip` (photo / page / audio / frame / text chip) |
| `Repo` (2026-11-05) | `RepoCard` (GitHub repo card: owner/name, description, chips, counting star total, green badge) + `GithubMark`; moved out of reels/ToolOfTheDay.tsx |
| `SaveCard` (2026-11-05) | the save frame (LESSONS 2026-11-05): one-screen cheat sheet with a bookmark tab, rows popping in; use for the last 3-4 s |
| `Whiteboard` (2026-11-07) | whiteboard scene for interview reels: `Whiteboard` (aluminium frame, marker tray), `InkBox` (hand-drawn box, `draw` 0-1, `cross` red X, `fill`), `InkText` (marker text writes left to right), `InkArrow` (bowed arrow, `dashed`, label), `InkCircle`, `marker` colours; `fonts.hand` (Caveat) added to `brand.ts` |
| `Hex` (2026-11-07) | dark city map cut into flat-top hexagons: `HexMap` (`heat(cell)` 0-1 tints clear → orange → deep red, `focus` cell ring, `grid` fade), `cellCenter`, `hexCells`, `heatColor`, `CarDot`, `RiderPin`, `Venue` |
| `Terminal` (2026-11-07) | `Terminal` (dark terminal; `typed` = characters shown across the whole session, outputs land after each command; tones ok/err/dim), `Pipeline` (service tiles S3 / Lambda / DynamoDB / link with arrows, `lit` count, a file `chip` travelling) |
| `Desktop` (2026-11-07) | laptop desktop: `Desktop` (wallpaper + taskbar), `FileIcon` (ext badge, `glow`), `Cursor`, `KeyCap` (`down` 0-1), `Donut` (radial menu at the cursor, `open`, `active` segment) |
| `People.CallTile` (fixed 2026-11-06) | name chip scales with the tile and sits on the shoulders; never covers the face (role hidden under 260 px) |
| `Transitions` (2026-11-02) | `whipPan`, `pushThrough`, `zoomBlur`, `lensZoom` (+ `TransitionSeries`, `linearTiming`) for real scene transitions between Beats |

## Third-party trial verdicts (2026-11-02, stills in `series/studio/out/sf/lib-sheet-*.png`, file `src/reels/styleframes/LibTrial.tsx`)

- **Use (wrapped in `Kit` / `Transitions`):** code-morph, imessage-chat-flow, number-wheel, ink-arrow, impact-shake,
  onda split-screen, onda underline, the 4 transitions.
- **Use as-is with `Band` + `brandVars`:** Remocn terminal-simulator (keep lines < 40 chars), message-bubble +
  typing-indicator, Odometer; onda CountUp (en-US commas), Timeline (4-5 short labels), LowerThird, BoundingBox
  (fractions of the Band canvas); snapcn follower-rush (vertical).
- **Needs work first:** marker-highlight / inline-highlight (hard-coded white box), toast / progress / stepper
  (labels < 32px at this scale), animated-bar-chart (8px labels), onda NodeGraph (20px fixed labels, dark hub),
  BrowserFrame, snapcn search-typing (camera crops it), status-cycle (blue slab).
- **Don't use:** ecosystem-constellation (fixed brand icons), snapcn count-grid (remote posters), onda CodeDiff /
  Remocn glass-code-block on light ground (dark glass, unreadable), onda SlotMachineRoll (bug: lands on wrong digits),
  onda DeviceFrame and snapcn phone-frame (our `Phone` is better), caption-speaker (we have `Captions`).

## Remocn — `src/components/remocn/`

| Group | Components |
| --- | --- |
| Captions (word-timed) | caption-speaker (dialogue, colour per speaker), caption-active-pop, caption-highlight-box |
| Chat / UI | imessage-chat-flow, message-bubble, typing-indicator, toast, progress, stepper, cursor |
| Code | terminal-simulator, glass-code-block, code-morph |
| Diagrams / data | ecosystem-constellation (hub + pulsing data lines), animated-bar-chart, animated-line-chart, number-wheel |
| Social | github-stars, x-follow-card |
| Text | word-stream, spring-scale-in, rolodex-flip, marker-highlight, inline-highlight |
| Accents | ink-arrow, brush |
| Camera / transitions | whip-pan, zoom-blur, focus-pull, push-through, lens-zoom, impact-shake, drift |
| Icons (animated) | phone, smartphone, database, wallet, users, user, shield, zap, cloud, globe, lock, check-circle, x-circle, clock, timer, bell, send, message-circle, credit-card, monitor, refresh-cw, trending-up, alert-triangle, search |

## snapcn — `src/components/snap-cn/`

**Paid-tier stubs, do not use** (they only play a watermarked "snapcn Pro preview" video from snapcn's
server; found 2026-11-02): chat-thread, checkout-push, comment-storm, tally-rise, tap-through, ticker-climb,
vault-count, wire-feed.

| Group | Real components |
| --- | --- |
| Devices | phone-frame |
| Numbers | count-grid |
| Social | follower-rush |
| Captions | karaoke-captions, word-captions |
| UI | search-typing, status-cycle, input, caret |

## onda — `src/components/onda/`

| Group | Components |
| --- | --- |
| Frames | browser-frame, device-frame, split-screen |
| Diagrams | node-graph (hub and spokes), timeline, callout, bounding-box |
| Numbers | count-up, slot-machine-roll |
| Text | blur-reveal, fade-in, slide-in, stagger-group, underline |
| Cards | lower-third, end-card |
| Texture | dynamic-grid, grain-overlay |
| Code | code-diff |
