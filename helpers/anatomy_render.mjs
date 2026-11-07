// Render a live anatomy page (rAF/setTimeout-driven) deterministically for video: a virtual clock stepped at a
// fixed fps, one JPEG per frame. Uses playwright-core from the Opuscar library (C:/Users/mrsac/lemo-opuscar).
//
// node helpers/anatomy_render.mjs <page.html> <framesDir> --to 70 [--from 0] [--fps 30] [--w 1080] [--h 1920]
//      [--scale 1] [--select .rp-stage] [--focus .rp-stage] [--cues cues.json] [--drop-timer 3600] [--css reel.css]
// --css: extra stylesheet injected after load (e.g. stronger focus dimming / accent strokes for the reel).
//
// --cues: JSON [{ "t": 2.5, "key": "ArrowRight" }, { "t": 30, "key": "i" }] pressed on --focus at that time
//         (keyboard-driven figures: arrows step through parts, Space apart, I ignite, Escape reset).
// --drop-timer: ignore setTimeout calls with exactly this delay (e.g. the 3600 ms idle timer that starts a
//         figure's own tour), so only the cues move it.
// --select: clip each frame to this element (e.g. the stage without the card chrome); --scale: device pixel ratio.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
const { chromium } = createRequire("C:/Users/mrsac/lemo-opuscar/package.json")("playwright-core");

const [pagePath, out, ...rest] = process.argv.slice(2);
const opt = { from: 0, to: 10, fps: 30, w: 1080, h: 1920, scale: 1, select: "", focus: "", cues: "", "drop-timer": 0, css: "" };
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, "")] = rest[i + 1];
const cues = opt.cues ? JSON.parse(readFileSync(opt.cues, "utf8")).sort((a, b) => a.t - b.t) : [];

const shim = `(() => {
  let now = 0, id = 1; const raf = new Map(), timers = new Map(); const DROP = ${+opt["drop-timer"] || -1};
  performance.now = () => now; Date.now = () => 1.7e12 + now;
  window.requestAnimationFrame = (cb) => { raf.set(id, cb); return id++; };
  window.cancelAnimationFrame = (i) => raf.delete(i);
  window.setTimeout = (cb, ms = 0, ...a) => { if (ms === DROP) return id++; timers.set(id, { at: now + ms, cb, a }); return id++; };
  window.clearTimeout = (i) => timers.delete(i);
  window.__step = (ms) => {
    const end = now + ms;
    for (;;) { let next = null;
      for (const [k, t] of timers) if (t.at <= end && (!next || t.at < next[1].at)) next = [k, t];
      if (!next) break; timers.delete(next[0]); now = Math.max(now, next[1].at); next[1].cb(...next[1].a); }
    now = end; const cbs = [...raf.values()]; raf.clear(); cbs.forEach((cb) => cb(now));
  };
})();`;

const browser = await chromium.launch({ args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist"] });
const page = await browser.newPage({ viewport: { width: +opt.w, height: +opt.h }, deviceScaleFactor: +opt.scale });
await page.addInitScript(shim);
page.on("pageerror", (e) => console.log("pageerror", e.message));
await page.goto("file:///" + pagePath.split(String.fromCharCode(92)).join("/"));
await page.waitForTimeout(1500);
if (opt.css) await page.addStyleTag({ content: readFileSync(opt.css, "utf8") });
if (opt.focus) await page.focus(opt.focus);
const clipEl = opt.select ? await page.$(opt.select) : null;
const dt = 1000 / +opt.fps;
let n = 0, ci = 0;
for (let t = 0; t < +opt.to * 1000 - 1e-6; t += dt) {
  while (ci < cues.length && cues[ci].t * 1000 <= t) await page.keyboard.press(cues[ci++].key);
  await page.evaluate((d) => window.__step(d), dt);
  if (t >= +opt.from * 1000 - 1e-6) {
    const path = `${out}/f${String(n++).padStart(5, "0")}.jpg`;
    if (clipEl) await clipEl.screenshot({ path, type: "jpeg", quality: 92 });
    else await page.screenshot({ path, type: "jpeg", quality: 92 });
  }
}
console.log("frames", n);
await browser.close();
