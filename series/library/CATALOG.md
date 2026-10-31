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

## Series (ours) — `src/series/`

| Scene | What it is |
| --- | --- |
| `brand.ts` | InternHack tokens, fonts (Space Grotesk / Inter / JetBrains Mono), safe area, shared theme for Remocn + snapcn |
| `SeriesFrame` | warm off-white ground, drifting dot grid, series badge (logo + series name + Day/Ep), handle; wraps the Remocn and snapcn theme providers |
| `CommentPrompt` | the comment-driver card: question, two answer chips, reply box typing an answer |
| `FollowCard` | InternHack profile card, tap on Follow flips to Following |
| `demo/SeriesKitDemo` | smoke test of the kit (not a reel) |

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

| Group | Components |
| --- | --- |
| Devices | phone-frame, tap-through |
| Money / numbers | checkout-push (fixed demo, no props), vault-count, tally-rise, ticker-climb, count-grid |
| Social | comment-storm, follower-rush, chat-thread |
| Captions | karaoke-captions, word-captions |
| UI | search-typing, status-cycle, wire-feed, input |

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
