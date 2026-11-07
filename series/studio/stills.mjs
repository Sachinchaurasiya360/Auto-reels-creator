// Style-frame stills and contact sheets for the gate and the frame check, from ONE bundle.
//
//   node stills.mjs <compositionId> <outDir> <sec> [sec ...]        e.g. node stills.mjs swiggy-live-map out/sf/sw 1.5 30 62
//
// Writes <outDir>/<id>-<sec>.png per second and <outDir>/<id>-sheet.png (all of them tiled, labelled, 4 per row).
// Uses the GPU (angle) like the renders (series/LESSONS: render on GPU).
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [id, outDir, ...secs] = process.argv.slice(2);
if (!id || !outDir || !secs.length) {
  console.error("usage: node stills.mjs <compositionId> <outDir> <sec> [sec ...]");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });
// bundle with the CLI so remotion.config.ts (rspack, tailwind, the "@" alias) applies; the Node bundle() API ignores it
const serveUrl = path.resolve("out/bundle-stills");
execFileSync("npx", ["remotion", "bundle", "--out-dir", serveUrl], { stdio: "ignore", shell: true });
const composition = await selectComposition({ serveUrl, id, chromiumOptions: { gl: "angle" } });
const files = [];
for (const s of secs.map(Number)) {
  const frame = Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps));
  const output = path.join(outDir, `${id}-${s}.png`);
  await renderStill({ serveUrl, composition, frame, output, chromiumOptions: { gl: "angle" }, scale: 0.5 });
  files.push({ output, s });
  console.log(output);
}
// contact sheet: ffmpeg labels + tile
const cols = Math.min(4, files.length);
const rows = Math.ceil(files.length / cols);
const inputs = files.flatMap((f) => ["-i", f.output]);
const labelled = files.map((f, i) => `[${i}:v]drawtext=text='${f.s}s':x=16:y=16:fontsize=36:fontcolor=white:box=1:boxcolor=black@0.6:boxborderw=8[v${i}]`).join(";");
const pad = files.length < cols * rows ? `;color=c=white:s=540x960:d=1[blank]` : "";
const all = files.map((_, i) => `[v${i}]`).join("") + (files.length < cols * rows ? "[blank]".repeat(cols * rows - files.length) : "");
const sheet = path.join(outDir, `${id}-sheet.png`);
execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", `${labelled}${pad};${all}xstack=inputs=${cols * rows}:layout=${layout(cols, rows)}`, "-frames:v", "1", sheet]);
console.log(sheet);

function layout(c, r) {
  const cells = [];
  for (let y = 0; y < r; y++) for (let x = 0; x < c; x++) cells.push(`${x * 540}_${y * 960}`);
  return cells.join("|");
}
