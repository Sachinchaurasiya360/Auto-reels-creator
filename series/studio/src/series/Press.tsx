import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// News-reel proof pieces (style from the Hyderabad vaccine reference): editorial serif titles and real
// source pages / posts with the quoted line highlighted by a black marker sweep.

// Big serif headline with an optional italic second line ("Genetic data / from your tumour").
export const SerifTitle = ({ x, y, w = 900, title, sub, size = 120, color = colors.ink, align = "left" }: { x: number; y: number; w?: number; title: ReactNode; sub?: ReactNode; size?: number; color?: string; align?: "left" | "center" }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, textAlign: align, color, fontFamily: fonts.serif, lineHeight: 0.95 }}>
    <div style={{ fontSize: size, letterSpacing: -2 }}>{title}</div>
    {sub ? <div style={{ fontSize: size * 0.5, fontStyle: "italic", marginTop: size * 0.12, color: colors.muted }}>{sub}</div> : null}
  </div>
);

// A quoted line; `hl` 0-1 sweeps a black marker across it left to right and turns the text white.
export const Marked = ({ children, hl }: { children: ReactNode; hl: number }) => (
  <span style={{ backgroundImage: `linear-gradient(90deg, ${colors.ink} ${hl * 100}%, transparent ${hl * 100}%)`, color: hl > 0.5 ? "#fff" : "inherit", padding: "2px 6px", boxDecorationBreak: "clone", WebkitBoxDecorationBreak: "clone" }}>{children}</span>
);

// Source page: site bar, date, serif headline and body paragraphs. Paragraphs are ReactNodes, so wrap
// the quoted part in <Marked>.
export function SourceCard({ x, y, w = 900, site, date, headline, paras, rotate = 0 }: { x: number; y: number; w?: number; site: string; date?: string; headline: ReactNode; paras: ReactNode[]; rotate?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, transform: `rotate(${rotate}deg)`, background: "#fffdf8", borderRadius: 10, boxShadow: "0 40px 80px -30px rgba(12,10,9,0.5)", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 30px", borderBottom: `3px solid ${colors.border}`, fontFamily: fonts.body, fontWeight: 800, fontSize: 28, color: colors.muted }}>
        <span>{site}</span>
        {date ? <span style={{ fontWeight: 600 }}>{date}</span> : null}
      </div>
      <div style={{ padding: "22px 30px 30px" }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 64, lineHeight: 1.02, color: colors.ink }}>{headline}</div>
        {paras.map((p, i) => (
          <div key={i} style={{ fontFamily: fonts.serif, fontSize: 40, lineHeight: 1.35, color: "#292524", marginTop: 18 }}>{p}</div>
        ))}
      </div>
    </div>
  );
}

// Post on X: avatar initials, name + verified tick, handle, text (ReactNode, can hold <Marked>).
export function XPost({ x, y, w = 900, name, handle, initials, text, time }: { x: number; y: number; w?: number; name: string; handle: string; initials: string; text: ReactNode; time?: string }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, background: "#fff", borderRadius: 28, padding: "26px 30px", boxShadow: "0 40px 80px -30px rgba(12,10,9,0.5)", fontFamily: fonts.body }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 80, height: 80, borderRadius: 99, background: colors.code, color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: 30 }}>{initials}</div>
        <div>
          <div style={{ fontSize: 34, fontWeight: 800, color: colors.ink }}>
            {name} <span style={{ color: colors.blue }}>✔</span>
          </div>
          <div style={{ fontSize: 28, color: colors.muted }}>{handle}</div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 44, fontWeight: 800 }}>𝕏</div>
      </div>
      <div style={{ fontSize: 38, lineHeight: 1.35, color: colors.ink, marginTop: 18 }}>{text}</div>
      {time ? <div style={{ fontSize: 26, color: colors.muted, marginTop: 14 }}>{time}</div> : null}
    </div>
  );
}
