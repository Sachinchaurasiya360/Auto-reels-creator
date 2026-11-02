import { colors, fonts } from "./brand";

// Days as a grid of boxes that light up one by one (exposure windows, deadlines, "T+5" rules).
// `lit` = how many boxes are on; boxes after `warnFrom` light red instead of blue; `tag(i)` labels a box.
export function DayGrid({ x, y, days, lit, cols = 7, size = 110, warnFrom = Infinity, label, tag }: { x: number; y: number; days: number; lit: number; cols?: number; size?: number; warnFrom?: number; label?: string; tag?: (i: number) => string | undefined }) {
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      {label ? <div style={{ fontFamily: fonts.mono, fontSize: 30, fontWeight: 700, color: colors.muted, marginBottom: 14, letterSpacing: 2 }}>{label}</div> : null}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap: size * 0.12 }}>
        {Array.from({ length: days }, (_, i) => {
          const on = i < lit;
          const warn = i + 1 >= warnFrom;
          const c = warn ? colors.red : colors.blue;
          return (
            <div key={i} style={{ height: size, borderRadius: size * 0.16, border: `4px solid ${on ? c : colors.border}`, background: on ? (warn ? "#fee2e2" : colors.blueSoft) : "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 700, color: on ? c : colors.faint }}>
              <div style={{ fontSize: size * 0.36 }}>{i + 1}</div>
              {tag?.(i) ? <div style={{ fontFamily: fonts.body, fontSize: Math.max(18, size * 0.17), fontWeight: 800 }}>{tag(i)}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
