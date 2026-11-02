import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// Space and navigation props: satellite with its onboard clock, a map with the phone's blue dot,
// and range rings (each satellite's "I'm this far away" circle) for trilateration.

// Clock face. `dead` stops the hands and crosses it out.
export const ClockFace = ({ size = 90, dead = false, t = 0 }: { size?: number; dead?: boolean; t?: number }) => {
  const a = dead ? 300 : t * 360;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle cx={50} cy={50} r={44} fill="#fff" stroke={dead ? colors.red : colors.ink} strokeWidth={7} />
      <line x1={50} y1={50} x2={50 + 26 * Math.sin((a * Math.PI) / 180)} y2={50 - 26 * Math.cos((a * Math.PI) / 180)} stroke={colors.ink} strokeWidth={6} strokeLinecap="round" />
      <line x1={50} y1={50} x2={50} y2={22} stroke={colors.ink} strokeWidth={4} strokeLinecap="round" />
      {dead ? <path d="M22 22 L78 78 M78 22 L22 78" stroke={colors.red} strokeWidth={9} strokeLinecap="round" /> : null}
    </svg>
  );
};

// Satellite: gold body, two solar wings, dish, and its clock on the body. `label` under it.
export function Satellite({ x, y, size = 1, angle = 0, dead = false, glow = 0, label, clockT = 0 }: { x: number; y: number; size?: number; angle?: number; dead?: boolean; glow?: number; label?: ReactNode; clockT?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 420 * size, textAlign: "center", opacity: dead ? 0.85 : 1 }}>
      <div style={{ position: "relative", width: 420 * size, height: 200 * size, transform: `rotate(${angle}deg)`, filter: glow ? `drop-shadow(0 0 ${30 * glow}px ${colors.blue})` : undefined }}>
        {[0, 1].map((s) => (
          <div key={s} style={{ position: "absolute", top: 60 * size, [s ? "right" : "left"]: 0, width: 140 * size, height: 80 * size, background: dead ? "#64748b" : "#1e3a8a", border: `${4 * size}px solid #cbd5e1`, backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.25) 2px, transparent 2px), linear-gradient(0deg, rgba(255,255,255,0.25) 2px, transparent 2px)", backgroundSize: `${28 * size}px ${26 * size}px` }} />
        ))}
        <div style={{ position: "absolute", left: 140 * size, top: 30 * size, width: 140 * size, height: 140 * size, borderRadius: 14 * size, background: "linear-gradient(135deg,#fcd34d,#d97706)", border: `${4 * size}px solid #92400e`, display: "grid", placeItems: "center" }}>
          <ClockFace size={88 * size} dead={dead} t={clockT} />
        </div>
        <div style={{ position: "absolute", left: 185 * size, top: -10 * size, width: 50 * size, height: 40 * size, borderRadius: "50% 50% 8px 8px", background: "#e5e7eb", border: `${3 * size}px solid #9ca3af` }} />
      </div>
      {label ? <div style={{ marginTop: 10, fontFamily: fonts.display, fontWeight: 700, fontSize: Math.max(32, 40 * size), color: dead ? colors.red : colors.ink }}>{label}</div> : null}
    </div>
  );
}

// Map tile (streets) for inside a Phone or on its own, with the blue location dot and its accuracy halo.
export function MapDot({ w, h, dx = 0.5, dy = 0.55, halo = 60, lost = false }: { w: number; h: number; dx?: number; dy?: number; halo?: number; lost?: boolean }) {
  const streets = [0.18, 0.42, 0.66, 0.88];
  return (
    <div style={{ position: "absolute", inset: 0, width: w, height: h, background: "#eef2e6", overflow: "hidden" }}>
      {streets.map((s, i) => (
        <div key={`h${i}`} style={{ position: "absolute", left: 0, right: 0, top: s * h, height: i === 1 ? 26 : 14, background: "#fff", transform: `rotate(${i % 2 ? -4 : 3}deg)` }} />
      ))}
      {streets.map((s, i) => (
        <div key={`v${i}`} style={{ position: "absolute", top: 0, bottom: 0, left: s * w, width: i === 2 ? 26 : 14, background: "#fff" }} />
      ))}
      <div style={{ position: "absolute", left: w * 0.55, top: h * 0.08, width: w * 0.3, height: h * 0.12, borderRadius: 12, background: "#bbf7d0" }} />
      <div style={{ position: "absolute", left: dx * w - halo, top: dy * h - halo, width: halo * 2, height: halo * 2, borderRadius: 999, background: lost ? "rgba(245,158,11,0.18)" : "rgba(0,116,255,0.16)", border: `3px solid ${lost ? colors.amber : colors.blue}55` }} />
      <div style={{ position: "absolute", left: dx * w - 18, top: dy * h - 18, width: 36, height: 36, borderRadius: 99, background: lost ? colors.amber : colors.blue, border: "6px solid #fff", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }} />
    </div>
  );
}

// Range ring around a point: "the phone is somewhere on this circle". Positioned by its centre.
export const RangeRing = ({ cx, cy, r, color = colors.blue, draw = 1 }: { cx: number; cy: number; r: number; color?: string; draw?: number }) => (
  <svg style={{ position: "absolute", left: cx - r - 6, top: cy - r - 6 }} width={2 * r + 12} height={2 * r + 12}>
    <circle cx={r + 6} cy={r + 6} r={r} fill="none" stroke={color} strokeWidth={6} strokeDasharray={`${2 * Math.PI * r * draw} ${2 * Math.PI * r}`} opacity={0.8} />
  </svg>
);
