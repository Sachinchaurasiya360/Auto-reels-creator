// Sarvam AI (Bulbul) text-to-speech for reel voiceovers.
//
// Reads a script (plain text; blank lines are paragraph breaks), streams speech from
// Sarvam, and writes an mp3, or a 48 kHz mono wav when -o ends in .wav (what
// helpers/transcribe.py and the HyperFrames build expect).
//
// Key: SARVAM_API_KEY in the repo's .env (gitignored) or the environment.
//
// Usage (from the repo root):
//   node helpers/sarvam/tts.mjs reels/<dir>/script.txt -o reels/<dir>/voiceover.wav
//   node helpers/sarvam/tts.mjs script.txt -o vo.wav --speaker ratan_hi_documentary --lang hi-IN --pace 1.15
//   node helpers/sarvam/tts.mjs --text "नमस्ते" -o test.mp3
//   node helpers/sarvam/tts.mjs --speakers hi      # list speaker ids containing "hi"
//
// Text over 3,400 characters is split at paragraph breaks and joined with a short pause.
// Numbers above 4 digits need commas ("10,000") to be read as one number.

import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { SarvamAIClient } from "sarvamai";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const MAX_CHARS = 3400; // API limit is 3,500 per request
const PARAGRAPH_GAP_S = 0.35;

const DEFAULTS = {
  speaker: "kalpit_en_edtech",
  model: "bulbul:v4-flash",
  lang: "en-IN", // code-mixed Hindi/English text works with en-IN on the *_en_* personas; use hi-IN with *_hi_* speakers
  pace: 1.1,
  rate: 24000,
};

function parseArgs(argv) {
  const a = { ...DEFAULTS, force: false };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    const next = () => argv[++i];
    if (k === "-o" || k === "--output") a.output = next();
    else if (k === "--text") a.text = next();
    else if (k === "--speaker") a.speaker = next();
    else if (k === "--model") a.model = next();
    else if (k === "--lang") a.lang = next();
    else if (k === "--pace") a.pace = Number(next());
    else if (k === "--rate") a.rate = Number(next());
    else if (k === "--temperature") a.temperature = Number(next());
    else if (k === "--force") a.force = true;
    else if (k === "--speakers") a.listSpeakers = argv[i + 1] && !argv[i + 1].startsWith("-") ? next() : "";
    else if (k === "-h" || k === "--help") a.help = true;
    else if (!a.script) a.script = k;
    else throw new Error(`unknown argument: ${k}`);
  }
  return a;
}

function loadKey() {
  for (const f of [path.join(REPO, ".env"), path.resolve(".env")]) {
    if (!fs.existsSync(f)) continue;
    for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*SARVAM_API_KEY\s*=\s*(.+?)\s*$/);
      if (m) return m[1].replace(/^["']|["']$/g, "");
    }
  }
  if (process.env.SARVAM_API_KEY) return process.env.SARVAM_API_KEY;
  throw new Error("SARVAM_API_KEY not found in .env or the environment");
}

function listSpeakers(filter) {
  const types = path.join(REPO, "helpers/sarvam/node_modules/sarvamai/dist/cjs/api/types/TextToSpeechSpeaker.d.ts");
  const ids = [...fs.readFileSync(types, "utf8").matchAll(/"([a-z_]+)"/g)].map((m) => m[1]);
  console.log([...new Set(ids)].filter((s) => s.includes(filter)).join("\n"));
}

// Split at paragraph breaks so no request exceeds MAX_CHARS; a single oversized paragraph splits at sentence ends.
function chunk(text) {
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const out = [];
  let cur = "";
  const push = (s) => {
    if (cur && cur.length + s.length + 2 > MAX_CHARS) { out.push(cur); cur = ""; }
    cur = cur ? `${cur}\n\n${s}` : s;
  };
  for (const p of paras) {
    if (p.length <= MAX_CHARS) { push(p); continue; }
    for (const s of p.split(/(?<=[।.?!])\s+/)) push(s);
  }
  if (cur) out.push(cur);
  return out;
}

async function synth(client, a, text, file) {
  const req = {
    text,
    language_code: a.lang,
    speaker: a.speaker,
    model: a.model,
    pace: a.pace,
    speech_sample_rate: a.rate,
    output_audio_codec: "mp3",
  };
  if (a.temperature !== undefined) req.temperature = a.temperature;
  const res = await client.textToSpeech.convertStream(req);
  await pipeline(Readable.fromWeb(res.stream()), fs.createWriteStream(file));
}

function ffmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });
}

async function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.help) { console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter((l) => l.startsWith("//")).join("\n")); return; }
  if (a.listSpeakers !== undefined) { listSpeakers(a.listSpeakers); return; }
  if (!a.output) throw new Error("pass -o <output.wav|output.mp3>");
  const text = (a.text ?? fs.readFileSync(a.script, "utf8")).replace(/^#.*$/gm, "").trim();
  if (!text) throw new Error("empty script");

  const out = path.resolve(a.output);
  if (fs.existsSync(out) && !a.force) { console.log(`exists, skipping (use --force): ${out}`); return; }
  fs.mkdirSync(path.dirname(out), { recursive: true });

  const client = new SarvamAIClient({ apiSubscriptionKey: loadKey() });
  const parts = chunk(text);
  const tmp = fs.mkdtempSync(path.join(path.dirname(out), ".sarvam-"));
  try {
    const files = [];
    for (const [i, t] of parts.entries()) {
      const f = path.join(tmp, `${String(i + 1).padStart(2, "0")}.mp3`);
      process.stdout.write(`  ${i + 1}/${parts.length}  ${t.length} chars ... `);
      await synth(client, a, t, f);
      console.log("ok");
      files.push(f);
    }
    const wav = out.toLowerCase().endsWith(".wav");
    const target = wav ? ["-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le"] : ["-c:a", "libmp3lame", "-b:a", "192k"];
    if (files.length === 1) {
      ffmpeg(["-i", files[0], ...target, out]);
    } else {
      const inputs = files.flatMap((f) => ["-i", f]);
      const gap = `aevalsrc=0:d=${PARAGRAPH_GAP_S}:s=${a.rate}`;
      let graph = "";
      const labels = [];
      files.forEach((_, i) => {
        graph += `[${i}:a]aresample=${a.rate},aformat=channel_layouts=mono[a${i}];`;
        labels.push(`[a${i}]`);
        if (i < files.length - 1) { graph += `${gap}[g${i}];`; labels.push(`[g${i}]`); }
      });
      graph += `${labels.join("")}concat=n=${labels.length}:v=0:a=1[out]`;
      ffmpeg([...inputs, "-filter_complex", graph, "-map", "[out]", ...target, out]);
    }
    const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString().trim();
    console.log(`voiceover: ${out} (${Number(dur).toFixed(1)}s, ${a.speaker}, ${a.model}, pace ${a.pace})`);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(`sarvam tts failed: ${e.message ?? e}`);
  process.exit(1);
});
