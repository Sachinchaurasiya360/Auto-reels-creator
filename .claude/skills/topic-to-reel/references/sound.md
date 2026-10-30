# Sound: levels, variety, music

Rules from the user's editor (October 2026), plus what makes sound feel designed rather than generated.

## 1. Levels

| Layer | Level | `data-volume` (linear) |
| --- | --- | --- |
| Voiceover | reference, 0 dB; final mix -14 LUFS integrated, -1 dBTP | 1.0 |
| **SFX** | **-8 to -12 dB** (the editor's rule); -8 dB only for the 1-3 biggest hits, -10 to -12 dB for everything else | 0.40 (-8), 0.32 (-10), 0.25 (-12) |
| Music bed | -18 to -24 dB under the voice, ducked a further 3-6 dB under speech | 0.06-0.12 |

dB to linear: `10 ** (dB / 20)`. Many library files are mastered hot: measure each one (`npx hyperframes audio <file> --json`) and normalize the library files to -16 LUFS before placing, so the clip gain means the same for every sound.

Check the rendered file: `npx hyperframes audio final.mp4 --json` and an `ebur128` pass. No SFX peak may come within 8 dB of the voice's peaks. Say in the delivery note that the mix was measured, not heard.

## 2. Variety: match the sound to the action

No whoosh by default. Every sound has a visible cause, and the sound is what that object would sound like. Pick from the action's row, rotate within it:

| On screen | Sounds |
| --- | --- |
| Money, coins, price | coin flip, single coin drop on wood, coins pouring, cash register ka-ching (once), banknote flick, counting machine |
| Numbers counting / ticker | mechanical counter clicks, slot-machine reel stop, split-flap board flutter |
| UI, screen, cursor | mouse click, trackpad tap, keyboard key, notification ding (once) |
| Receipt / screenshot appears | camera shutter, paper slide on desk, printer feed, photocopier |
| Photo cut-out lands | paper flap, cardboard tap, soft table thud, pin into corkboard |
| Typing / text building | typewriter keys and carriage bell, mechanical keyboard burst |
| Security, locks | padlock snap, door latch, vault dial ticks, bolt slide, key turning |
| Hacking, data | modem handshake fragment, hard-drive seek, short static crackle (once) |
| Signature, documents | pen scratch, stamp thump (once), paper rustle, folder slap |
| Failure, wrong | short buzzer, glass tink, record scratch (once) |
| Big reveal (the payoff) | low boom or sub drop with a short riser into it, once per reel |
| Transitions | page turn, paper tear, film sprocket, camera flash pop, match strike. **Whoosh at most once per reel.** |

Rules:
- The same file never plays twice within 10 seconds; keep 2-3 takes of anything that repeats and rotate them.
- At most one SFX per 0.25s unless layered on purpose (coin drop + counter click as one hit).
- 8-20 SFX for a 60s reel. More than one every 2 seconds is clutter.
- Place each sound so its peak lands **one frame after** its picture (`npx hyperframes audio <file> --json` shows where a file peaks; most peak after their start).
- Silence is a sound: drop all SFX for the 0.5s before the payoff so it lands harder.

## 3. Clicks: the editor's punctuation

Clicks do most of the work in a fast edit: they mark a cut, a word punch, an element locking into place. The library at `reels/_library/sfx/` (45 sounds, `manifest.json` lists each with duration and use; Mixkit licence, no attribution needed; every file trimmed so the hit is at t=0 and peak-normalized to -3 dBFS) has a click for each kind of edit event:

| Edit event | Click family | Files |
| --- | --- | --- |
| Hard cut to a new frame | mechanical, short | `mechanical/light-switch.mp3`, `mechanical/plastic-bubble-click.mp3`, `ui/checkbox-click.mp3` |
| Punch-in on a keyword | hard, dry | `mechanical/hard-pop-click.mp3`, `ui/mouse-hard-click.mp3`, `typewriter/typewriter-single-hit.mp3` |
| Word or label snapping into layout | soft UI | `ui/select-click.mp3`, `ui/interface-click-tone.mp3`, `ui/light-button.mp3` |
| Cursor action on a UI or screenshot | mouse | `ui/mouse-click-close.mp3`, `ui/mouse-double-click.mp3`, `ui/mouse-clicks-clear.mp3` |
| Receipt / screenshot / photo lands | camera | `camera/shutter-click.mp3`, `camera/old-shutter-click.mp3`, `camera/shutter-hard.mp3` |
| Two states toggling (before/after, on/off) | switch | `mechanical/light-switch-tap.mp3`, `ui/interface-device-click.mp3` |
| Something locks, closes, gets denied | lock | `lock/quick-lock.mp3`, `lock/gear-lock-tap.mp3`, `lock/safe-lock.mp3`, `lock/shut-and-lock.mp3` |
| Text typing in / keyword reveal | typewriter | `typewriter/typewriter-soft-hit.mp3` (rotate with `-single-hit`, `-hard-hit`), `typewriter/typewriter-bell.mp3` at the end of a line |
| A decision, a bet, a gamble | coin | `money/coin-flip.mp3` |
| A number or amount landing | coins / ATM | `money/coins-drop.mp3`, `money/coins-clinking.mp3`, `money/atm-key-press.mp3`, `money/money-bag-drop.mp3` (biggest number only) |
| A dramatic "nothing there" beat | empty | `mechanical/dry-fire-click.mp3` (once per reel at most) |
| Scene change between documents/ideas | paper | `paper/page-turn.mp3`, `paper/paper-slide.mp3`, `paper/paper-slice.mp3` |

How to use them like an editor:
- Rotate 2-3 files within a family; a reel with the same click on every cut sounds like a metronome.
- Layer for weight: a click plus a quiet paper slide on a big cut (offset 1-2 frames), the click on the accent.
- Rhythm: in a fast stretch, clicks on every second cut, not every cut; let the voice breathe.
- Level: clicks at -10 to -12 dB; only the payoff click or coin hit at -8 dB.
- Never a click on a cut that has no visible snap or change; a click with no picture reads as an error.

## 4. Finding more sounds

- Check `reels/_library/sfx/manifest.json` first.
- Mixkit pages (`https://mixkit.co/free-sound-effects/<category>/`) list free SFX; the file is `https://assets.mixkit.co/active_storage/sfx/<id>/<id>-preview.mp3`. Pair title and id within one `item-grid__item` block (proximity matching mislabels them). Trim the leading silence and peak-normalize to -3 dBFS before adding to the library, and record it in `manifest.json`.
- `npx hyperframes media-use resolve --type sfx --intent "coin flip on wooden table" --project composition` searches Openverse (CC0 / CC BY only) and falls back to the bundled library. Name the sound concretely ("padlock snap shut", not "lock sound").
- The bundled library (`~/.claude/skills/media-use/audio/assets/sfx/`) is small and generic (whooshes, glitches, pops). Use it only as a fallback, never as the palette.
- Build a reusable library: copy every good sound into `reels/_library/sfx/<category>/` with its credit line, and check there first next time.
- Credit CC BY sounds in `composition/assets/sfx/CREDITS.md` and in the post's pinned comment when required.

## 5. Music

- A bed under narration when a source exists: the user's track, a HeyGen catalog track (`media-use resolve --type bgm`, needs sign-in), or a royalty-free track the user provides. Feel and tempo from the topic (tense minimal pulse for a hack, bright for a launch).
- Enter on a strong bar, change once at the midpoint interrupt (drop out, then return), end on a bar line under the loop seam.
- No source: deliver without music and tell the user to add trending audio in-app at about 10-15% volume. Never synthesize music in code.

## 6. Placement in HyperFrames

Every `<audio>` gets an `id`, `class="clip"`, `data-start`, **`data-duration` = the file's length** (otherwise it's treated as running to the end of the film and lint flags overlaps), `data-volume`, and its own `data-track-index` lane so lanes don't overlap.
