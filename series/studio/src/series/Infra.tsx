import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// Backend props drawn as real objects: database, server, stored value, message envelope, stamp, speech bubble.

// Database cylinder. `glow` rings the lid amber (busy / locked); `shake` jitters it (overload).
export const Db = ({ x, y, size = 1, label = "Database", glow = 0, shake = 0 }: { x: number; y: number; size?: number; label?: string; glow?: number; shake?: number }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 300 * size, textAlign: "center", transform: `translateX(${shake}px)` }}>
    <svg width={300 * size} height={250 * size} viewBox="0 0 300 250">
      <path d="M20 40 V200 A130 34 0 0 0 280 200 V40" fill={colors.code} />
      <ellipse cx={150} cy={40} rx={130} ry={34} fill="#262a33" stroke={glow > 0 ? colors.amber : "#3f3f46"} strokeWidth={6} />
      <path d="M20 95 A130 34 0 0 0 280 95 M20 150 A130 34 0 0 0 280 150" fill="none" stroke="#3f3f46" strokeWidth={4} />
    </svg>
    <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: Math.max(32, 40 * size) }}>{label}</div>
  </div>
);

// Dark server panel with a green status dot and a mono title; children are its readout.
export const Server = ({ x, y, w = 420, title, children }: { x: number; y: number; w?: number; title: string; children?: ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 28, background: colors.code, color: "#fff", padding: "20px 26px", boxShadow: "0 40px 80px -30px rgba(12,10,9,0.55)", fontFamily: fonts.mono }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 32, fontWeight: 700, color: "#a8a29e" }}>
      <span style={{ width: 16, height: 16, borderRadius: 99, background: colors.lime }} />
      {title}
    </div>
    {children}
  </div>
);

// One stored value (cache entry, DB row): dark title bar, big value, optional sub line; `glow` rings it red.
export const Store = ({ x, y, w = 420, title, value, sub, color, glow = 0, children }: { x: number; y: number; w?: number; title: string; value: ReactNode; sub?: ReactNode; color: string; glow?: number; children?: ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 30, background: "#fff", overflow: "hidden", boxShadow: `0 30px 60px -30px rgba(12,10,9,0.45), 0 0 0 ${glow * 8}px ${colors.red}55` }}>
    <div style={{ background: colors.code, color: "#fff", fontFamily: fonts.mono, fontSize: 32, fontWeight: 700, padding: "14px 24px" }}>{title}</div>
    <div style={{ padding: "18px 24px", fontFamily: fonts.display }}>
      <div style={{ fontSize: 80, fontWeight: 700, color, minHeight: 96 }}>{value}</div>
      {sub ? <div style={{ fontFamily: fonts.body, fontSize: 32, color: colors.muted }}>{sub}</div> : null}
      {children}
    </div>
  </div>
);

// A message as a physical envelope (SMS, request, packet). Unpositioned: place it with Travel or a wrapper.
export const Envelope = ({ label = "OTP", color = colors.blue }: { label?: string; color?: string }) => (
  <div style={{ width: 150, height: 104, borderRadius: 14, background: "#fff", border: `5px solid ${color}`, position: "relative", boxShadow: "0 16px 30px -14px rgba(12,10,9,0.45)" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderTop: `48px solid ${color}`, opacity: 0.25 }} />
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", paddingTop: 22, fontFamily: fonts.mono, fontWeight: 800, fontSize: 30, color }}>{label}</div>
  </div>
);

// Rubber stamp that slams in as `s` goes 0 -> 1 (e.g. "BINA POOCHE", "DROP").
export const Stamp = ({ s, x, y, children, color = colors.red }: { s: number; x: number; y: number; children: ReactNode; color?: string }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${2.2 - 1.2 * s}) rotate(-8deg)`, opacity: s, border: `8px solid ${color}`, color, borderRadius: 18, padding: "8px 26px", fontFamily: fonts.display, fontWeight: 700, fontSize: 56, background: "#fff" }}>{children}</div>
);

// Speech bubble for a drawn person, growing from its bottom-left corner.
export const Bubble = ({ x, y, w, children, s = 1 }: { x: number; y: number; w: number; children: ReactNode; s?: number }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, transform: `scale(${s})`, transformOrigin: "0% 100%", borderRadius: 30, background: "#fff", padding: "20px 26px", fontFamily: fonts.display, fontWeight: 700, fontSize: 44, boxShadow: "0 24px 50px -24px rgba(12,10,9,0.45)" }}>
    {children}
  </div>
);
