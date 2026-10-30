# Assets: generated cut-outs, props and receipts

The user's choice: **AI image generation** for photos and props, background removed locally. Real screenshots for receipts. Never draw the hero of a shot as flat SVG.

## 1. Asset list

From `EDIT_PLAN.md`, list every asset with its beat, kind and prompt before generating anything:

```
id          beat  kind        prompt (short)                                   size
a01-laptop  B01   photo-cut   laptop hanging from a crane hook, top-down       1024
a02-cheques B07   photo-cut   fan of 50 blank cheques, one signed              1024
a03-vault   B09   3d-prop     round bank vault door, matte clay                1024
r01-headline B02  receipt     CoinDesk headline (screenshot)                   -
```

Reuse before generating: `~/.media/` and earlier reels' `composition/assets/img/` often already hold a usable hand, laptop or vault.

## 2. Generating

- Tool: ChatCut image generation (load `chatcut:chatcut-plugin-basics-claude`, then `chatcut:image-gen`, and call `submit_image`). It needs **ChatCut Pro**: check `read_billing` first (on 2026-10-31 the account had no Pro membership). Without Pro, tell the user at gate 2 and offer: upgrade, generate the listed prompts in another generator they have and drop the files into `composition/assets/img/raw/`, or fall back to real photos (Wikimedia Commons CC0/CC BY) cut out locally. Estimate first (`estimate_generation`) and tell the user the total cost at gate 2 before generating the full batch. HeyGen via `npx hyperframes media-use resolve --type image --intent "..."` is an asset search, useful for generic objects.
- Generate the 3 style-frame assets first (gate 2), the rest only after approval.
- One shared style suffix for every prompt in a reel, so the collage looks like one shoot:

**Photo cut-out** (objects, hands, people doing things):
```
<subject, action, camera angle>. Black and white editorial photograph, isolated on a plain
light grey seamless background, soft key light from upper left, crisp detail, realistic,
full object in frame with margin, no text, no logos, no watermark.
```

**3D prop** (clean objects, symbols):
```
<object>. 3D render, matte clay material in <ground hue name> (<hex>), single object centred,
plain <ground light hex> background, soft studio lighting from upper left, subtle contact
shadow, no text, no logos.
```

**Surreal metaphor**: combine two real things in one photo prompt ("a laptop lifted by three lightbulb balloons", "a vault door made of a computer keyboard"). Keep it one readable silhouette.

- Square 1024 px minimum; 1536 px for anything that fills the frame or gets punched into.
- Generate 2 variants per hero asset and pick; 1 for minor props.
- Never generate a real, named person, a real company logo or a real product UI. People in the reel are anonymous ("a DevOps engineer at a desk, face turned away").

## 3. Receipts (real screenshots)

- Capture the actual headline, post, chart or on-chain transaction found in research: the browser tool screenshot (Playwright `browser_take_screenshot` or `browser-use`), cropped to the relevant block at 2x scale.
- Present it as a physical object in the scene (paper or phone, slight rotation, soft shadow), then zoom into the key line and highlight it in the accent colour.
- Keep the source visible (masthead or handle), and list the URL in `research.md`.

## 4. Cut out, tint, register

1. Background removal: `npx hyperframes remove-background <in.png> -o composition/assets/img/<id>.png --quality best`. Check the edge at 200% on hair, fingers and thin parts; regenerate rather than ship a halo.
2. Treatment into the colour world: B&W cut-outs stay B&W (the world's ground does the tinting); duotone or tint through `npx hyperframes media-treatment` (`--capabilities --json` lists the palette and duotone controls), never CSS filters.
3. Shadow: a soft contact shadow as its own element under the cut-out (blurred ellipse, 25-35% ink), not `drop-shadow` on the image.
4. Name files by id, record each in `project.md` with prompt, tool and cost.

## 5. Fonts

- Latin bundled faces resolve by name (Oswald, League Gothic, Archivo Black, Inter, Montserrat, ...). Any other face: download the TTF from `github.com/google/fonts/raw/main/ofl/<family>/...` into `composition/assets/fonts/`, and declare `@font-face` in **every** composition file that uses it (`assets/fonts/...`, no leading slash).
- Light italics for connector words: Oswald has no italic; pair with Inter Italic / Barlow Condensed Italic (downloaded).
- Devanagari faces: `hindi.md`.
