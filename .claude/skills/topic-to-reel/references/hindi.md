# Hindi and Hinglish reels

## Script

- Write the way Indian tech creators talk: Hindi sentence structure, English tech words kept in English (laptop, hack, system, transaction, wallet). Conversational, never textbook Hindi ("जल्दबाज़ी नहीं करते" yes, "शीघ्रता नहीं करते" no).
- For TTS input, write everything in Devanagari, with English words transliterated (लैपटॉप, बाइनेंस, ट्रांज़ैक्शन). Numbers as words (छह दशमलव तीन अरब डॉलर). Add the rupee conversion for big dollar amounts (₹ crore), conservatively rounded.
- No spoken "स्टेप वन / स्टेप टू". Tell it as a story ("कहानी शुरू होती है...", "और फिर...").
- Length: Hindi TTS runs ~150-180 wpm; count words yourself (the Latin-only checkers report 0). A 170-word script is about 60-70s.
- The hook scorer and humanizer don't read Devanagari: score an English gloss, or judge by hand and say so.

## Voice

- Chatterbox (`helpers/voiceover.py`) is English-only. Hindi voice comes from Sarvam AI (Bulbul) via the API, or a recording the user supplies.
- **Sarvam API:** `node helpers/sarvam/tts.mjs reels/<dir>/script.txt -o reels/<dir>/voiceover.wav` (keys `sarvam_api_key1` / `sarvam_api_key2` in `.env`, the second used when the first is out of credit; first run `npm install` in `helpers/sarvam/`). Defaults are the user's chosen settings: speaker `kalpit_en_edtech`, model `bulbul:v4-flash`, language `en-IN` (handles Hinglish code-mix), pace 1.1, 24 kHz. Other voices: `node helpers/sarvam/tts.mjs --speakers hi_` (e.g. `anand_hi_news`, `ratan_hi_documentary` with `--lang hi-IN`). Text over 3,400 characters is split at paragraph breaks automatically; existing output is kept unless `--force`.
- The script for Sarvam may mix Devanagari and English words (the user's sample does: "accounting adjustment", "IPO"); numbers over 4 digits need commas.

## Word timings

- `python helpers/transcribe.py <vo> --edit-dir <dir>/edit --language hi`. Scribe returns Hinglish: Hindi in Devanagari, English words in Latin, numbers as digits. That's the right caption convention, keep it.
- Scribe mishears some words. Fix the caption text by word index and keep the timing; keep sentence-ending punctuation on the fixed word, or the caption grouping merges two sentences. Mishearings seen so far: फ़र्ज़ी → "4G", पचासों → "500", साढ़े → "सारे", साफ़ → "साफ".

## Fonts (Devanagari + Latin in one face)

Download from `github.com/google/fonts/raw/main/ofl/<family>/` into `composition/assets/fonts/` and declare `@font-face` in every file that uses them.

| Role | Faces |
| --- | --- |
| Hero (condensed, bold) | Teko 600-700, Khand 700, Rajdhani 700 |
| Hero (expressive) | Yatra One, Baloo 2 800, Rozha One (serif) |
| Support / captions | Mukta 700-800, Hind 600-700, Baloo 2 600 |
| Connector (light) | Mukta 300, Hind 300 (Devanagari has no true italic; use the light weight and a smaller size instead) |

- Devanagari sits taller than Latin: set line-height 1.15-1.25 and leave space above for the matras, or they collide with the line above.
- Teko's digits and Latin caps are excellent for numbers; Mukta reads best at caption sizes.
