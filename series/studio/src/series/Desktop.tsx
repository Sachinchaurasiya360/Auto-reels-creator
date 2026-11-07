import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// Laptop-desktop scene (2026-11-07, Filee reel): a Windows-like desktop, file icons, a mouse cursor, a key cap, and the
// radial "donut" menu that opens at the cursor (Filee: hold Ctrl + drag a file). Desktop-local px.

export function Desktop({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, overflow: "hidden", background: "linear-gradient(150deg,#1e3a8a 0%,#2563eb 45%,#60a5fa 100%)", boxShadow: "0 50px 100px -40px rgba(12,10,9,0.6)", border: "10px solid #111827" }}>
      <div style={{ position: "absolute", left: "-20%", top: "35%", width: "140%", height: "80%", borderRadius: "50%", background: "radial-gradient(closest-side, rgba(255,255,255,0.22), transparent)" }} />
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 56, background: "rgba(15,23,42,0.85)", display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
        {["#60a5fa", "#fbbf24", "#34d399", "#f472b6"].map((c) => (
          <div key={c} style={{ width: 30, height: 30, borderRadius: 8, background: c, opacity: 0.85 }} />
        ))}
      </div>
    </div>
  );
}

const extColor: Record<string, string> = { pdf: "#dc2626", jpg: "#0ea5e9", docx: "#2563eb", heic: "#7c3aed", png: "#0ea5e9" };

export function FileIcon({ x, y, name, ext, glow = 0, scale = 1 }: { x: number; y: number; name: string; ext: string; glow?: number; scale?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 150, textAlign: "center", transform: `scale(${scale})` }}>
      <div style={{ margin: "0 auto", width: 96, height: 120, borderRadius: 10, background: "#fff", position: "relative", boxShadow: glow ? `0 0 ${30 * glow}px rgba(163,230,53,${glow})` : "0 10px 20px rgba(0,0,0,0.25)", clipPath: "polygon(0 0,72% 0,100% 22%,100% 100%,0 100%)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, margin: "0 10px", padding: "4px 0", borderRadius: 6, background: extColor[ext] ?? colors.muted, color: "#fff", fontFamily: fonts.mono, fontWeight: 700, fontSize: 20 }}>{ext.toUpperCase()}</div>
      </div>
      <div style={{ marginTop: 8, fontFamily: fonts.body, fontWeight: 600, fontSize: 22, color: "#fff", textShadow: "0 1px 4px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>{name}</div>
    </div>
  );
}

export const Cursor = ({ x, y }: { x: number; y: number }) => (
  <svg style={{ position: "absolute", left: x, top: y, overflow: "visible" }} width={40} height={56} viewBox="0 0 40 56">
    <path d="M2 2 L2 44 L13 34 L21 52 L29 48 L21 31 L36 31 Z" fill="#fff" stroke="#0f172a" strokeWidth={3} strokeLinejoin="round" />
  </svg>
);

export const KeyCap = ({ label, down = 0 }: { label: string; down?: number }) => (
  <div style={{ width: 150, height: 110, borderRadius: 18, background: "#e5e7eb", boxShadow: `0 ${12 - 9 * down}px 0 #9ca3af`, transform: `translateY(${9 * down}px)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 44, color: colors.ink, border: "3px solid #9ca3af" }}>{label}</div>
);

// radial menu around (cx, cy): `open` 0-1 grows it, `active` highlights one segment
export function Donut({ cx, cy, items, open = 1, active = -1, r = 210 }: { cx: number; cy: number; items: string[]; open?: number; active?: number; r?: number }) {
  const n = items.length;
  const inner = r * 0.48;
  const seg = (i: number) => {
    const a0 = (i / n) * Math.PI * 2 - Math.PI / 2 + 0.03;
    const a1 = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2 - 0.03;
    const p = (rr: number, a: number) => `${cx + rr * Math.cos(a)} ${cy + rr * Math.sin(a)}`;
    return `M${p(inner, a0)} L${p(r, a0)} A${r} ${r} 0 0 1 ${p(r, a1)} L${p(inner, a1)} A${inner} ${inner} 0 0 0 ${p(inner, a0)} Z`;
  };
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${open})`, transformOrigin: `${cx}px ${cy}px`, opacity: Math.min(1, open * 1.5) }}>
      <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={1} height={1}>
        {items.map((_, i) => (
          <path key={i} d={seg(i)} fill={i === active ? colors.lime : "rgba(15,23,42,0.88)"} stroke="rgba(255,255,255,0.35)" strokeWidth={2} />
        ))}
      </svg>
      {items.map((it, i) => {
        const a = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
        const rr = (r + inner) / 2;
        return (
          <div key={it} style={{ position: "absolute", left: cx + rr * Math.cos(a), top: cy + rr * Math.sin(a), transform: "translate(-50%,-50%)", fontFamily: fonts.display, fontWeight: 700, fontSize: 28, color: i === active ? colors.ink : "#fff", whiteSpace: "nowrap" }}>
            {it}
          </div>
        );
      })}
    </div>
  );
}
