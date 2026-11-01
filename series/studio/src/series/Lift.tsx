import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// A building lift seen from the lobby: floor display on top, two steel doors that slide apart.
// `open` 0 = shut, 1 = fully open; children sit inside the cabin (behind the doors).
export function Lift({ x, y, w = 340, h = 600, open, floor = "G", children }: { x: number; y: number; w?: number; h?: number; open: number; floor?: string; children?: ReactNode }) {
  const door = (w / 2) * (1 - open);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div style={{ height: 64, borderRadius: 14, background: colors.code, color: colors.amber, fontFamily: fonts.mono, fontSize: 36, fontWeight: 700, display: "grid", placeItems: "center", marginBottom: 12 }}>▼ {floor} · LIFT</div>
      <div style={{ position: "relative", height: h, borderRadius: 18, border: "12px solid #a8a29e", background: "#fef9c3", overflow: "hidden" }}>
        {children}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: door, background: "linear-gradient(90deg,#a8a29e,#e7e5e4)", borderRight: "3px solid #78716c" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: door, background: "linear-gradient(270deg,#a8a29e,#e7e5e4)", borderLeft: "3px solid #78716c" }} />
      </div>
    </div>
  );
}
