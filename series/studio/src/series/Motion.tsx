import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "./brand";
import { ramp } from "./Reel";
import type { Pt } from "./System";

// Motion vocabulary on top of `Beat` (LESSONS.md rule 5): punch-ins on the detail that matters,
// a colour wipe between scenes, and an object travelling from A to B (cause -> effect).
// All times are reel seconds; pass `t` from useSeconds(beatFrom).

// Punch-in toward (ox, oy) in frame pixels: scales to `to` from `at`, optionally back out from `back`.
export function Punch({ t, at, to = 1.22, dur = 0.4, back, ox = 540, oy = 960, children }: { t: number; at: number; to?: number; dur?: number; back?: number; ox?: number; oy?: number; children: ReactNode }) {
  const inP = ramp(t, at, at + dur, Easing.inOut(Easing.cubic));
  const outP = back === undefined ? 0 : ramp(t, back, back + dur, Easing.inOut(Easing.cubic));
  const s = 1 + (to - 1) * (inP - outP);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: `${ox}px ${oy}px` }}>{children}</AbsoluteFill>;
}

// A circle of colour that floods the frame from (x, y) and then clears, hiding a cut at `at`.
// Place it as a sibling after the beats, at reel level (it reads the reel frame).
export function ColorWipe({ at, color, x = 540, y = 960, half = 0.28 }: { at: number; color: string; x?: number; y?: number; half?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < at - half || t > at + half) return null;
  const grow = interpolate(t, [at - half, at], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  const clear = interpolate(t, [at, at + half], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const r = 2300 * grow;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: "50%",
          background: color,
          opacity: 1 - clear,
        }}
      />
    </AbsoluteFill>
  );
}

// Moves its child (centred) from `from` to `to` between reel-times a and b. Hidden before a,
// and after b + hold (pass hold = Infinity to keep it parked at the end).
export function Travel({ t, a, b, from, to, hold = 0.3, arc = 0, children }: { t: number; a: number; b: number; from: Pt; to: Pt; hold?: number; arc?: number; children: ReactNode }) {
  if (t < a || t > b + hold) return null;
  const p = ramp(t, a, b, Easing.inOut(Easing.cubic));
  const x = from.x + (to.x - from.x) * p;
  const y = from.y + (to.y - from.y) * p - Math.sin(p * Math.PI) * arc;
  const fadeOut = Number.isFinite(hold) ? ramp(t, b + hold - 0.12, b + hold) : 0;
  const fade = Math.min(ramp(t, a, a + 0.12), 1 - fadeOut);
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)", opacity: fade }}>{children}</div>;
}

// Small pill used as a packet / label that travels or pops.
export function Pill({ children, bg, fg = "#fff", size = 34, mono = false }: { children: ReactNode; bg: string; fg?: string; size?: number; mono?: boolean }) {
  return (
    <div
      style={{
        padding: "12px 24px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: size,
        fontWeight: 700,
        whiteSpace: "nowrap",
        fontFamily: mono ? fonts.mono : fonts.body,
        boxShadow: "0 20px 40px -20px rgba(12,10,9,0.45)",
      }}
    >
      {children}
    </div>
  );
}
