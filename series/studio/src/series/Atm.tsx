import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// ATM drawn as the real machine: bank hood, screen (children), keypad, card slot and cash slot.
// `cash` 0-1 pushes notes out of the slot; `stuck` jams them half-way with a red slot light.

// One rupee note (₹500 stone grey by default). Unpositioned.
export const Note = ({ w = 300, value = "500", color = "#c9c4a8", rotate = 0 }: { w?: number; value?: string; color?: string; rotate?: number }) => (
  <div style={{ width: w, height: w * 0.45, borderRadius: 8, background: color, border: "3px solid #8f8a6c", position: "relative", transform: `rotate(${rotate}deg)`, boxShadow: "0 10px 20px -10px rgba(12,10,9,0.4)", fontFamily: fonts.display, fontWeight: 700, color: "#4d4a39" }}>
    <div style={{ position: "absolute", left: w * 0.06, top: w * 0.04, fontSize: w * 0.12 }}>₹{value}</div>
    <div style={{ position: "absolute", right: w * 0.08, top: w * 0.1, width: w * 0.22, height: w * 0.22, borderRadius: 99, border: "3px solid #8f8a6c", opacity: 0.6 }} />
    <div style={{ position: "absolute", left: w * 0.06, bottom: w * 0.04, fontSize: w * 0.06, letterSpacing: 2 }}>RESERVE BANK OF INDIA</div>
  </div>
);

export function Atm({ x, y, w = 560, bank = "SBI", screen, cash = 0, stuck = false, slotLight }: { x: number; y: number; w?: number; bank?: string; screen?: ReactNode; cash?: number; stuck?: boolean; slotLight?: string }) {
  const k = w / 560;
  const light = slotLight ?? (stuck ? colors.red : cash > 0 ? colors.lime : "#3f3f46");
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 900 * k }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30 * k, background: "linear-gradient(180deg,#e7e5e4,#d6d3d1)", boxShadow: "0 50px 90px -40px rgba(12,10,9,0.6)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110 * k, borderRadius: `${30 * k}px ${30 * k}px 0 0`, background: colors.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 * k, fontFamily: fonts.display, fontWeight: 700, fontSize: 52 * k }}>
        {bank} <span style={{ fontWeight: 500, opacity: 0.8 }}>ATM</span>
      </div>
      <div style={{ position: "absolute", left: 50 * k, right: 50 * k, top: 150 * k, height: 330 * k, borderRadius: 18 * k, background: "#0f172a", border: `${12 * k}px solid #44403c`, overflow: "hidden", color: "#e0f2fe", fontFamily: fonts.mono }}>
        {screen}
      </div>
      <div style={{ position: "absolute", left: 70 * k, top: 520 * k, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 * k, width: 250 * k }}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "✕", 0, "✓"].map((d, i) => (
          <div key={i} style={{ height: 44 * k, borderRadius: 8 * k, background: d === "✕" ? "#fca5a5" : d === "✓" ? "#bbf7d0" : "#f5f5f4", border: "2px solid #a8a29e", display: "grid", placeItems: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 24 * k, color: colors.ink }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", right: 70 * k, top: 540 * k, width: 160 * k, textAlign: "center", fontFamily: fonts.body, fontWeight: 700, fontSize: 22 * k, color: colors.muted }}>
        <div style={{ height: 22 * k, borderRadius: 6 * k, background: colors.code, border: `${4 * k}px solid ${colors.lime}` }} />
        <div style={{ marginTop: 8 * k }}>CARD</div>
      </div>
      <div style={{ position: "absolute", left: 90 * k, right: 90 * k, top: 760 * k, height: 34 * k, borderRadius: 10 * k, background: colors.code, boxShadow: `0 0 0 ${6 * k}px ${light}` }} />
      <div style={{ position: "absolute", left: 130 * k, top: 760 * k + 20 * k, overflow: "visible", transform: `translateY(${(stuck ? 0.35 : cash) * 120 * k}px)`, opacity: cash > 0 || stuck ? 1 : 0 }}>
        <Note w={300 * k} />
      </div>
    </div>
  );
}
