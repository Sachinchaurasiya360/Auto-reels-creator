import { colors, fonts } from "./brand";

// Database internals drawn as things you can point at.

// A table read row by row (full scan): `scan` 0-1 moves the read head down the rows; rows above it are greyed.
// `hit` marks the row that matches. `title` sits in the dark header bar.
export function RowScan({ x, y, w = 460, rows, scan, hit, title = "results" }: { x: number; y: number; w?: number; rows: string[]; scan: number; hit?: number; title?: string }) {
  const head = Math.min(rows.length - 1, Math.floor(scan * rows.length));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, borderRadius: 26, background: "#fff", overflow: "hidden", boxShadow: "0 30px 60px -30px rgba(12,10,9,0.45)", fontFamily: fonts.mono }}>
      <div style={{ background: colors.code, color: "#fff", fontSize: 30, fontWeight: 700, padding: "12px 22px" }}>{title}</div>
      {rows.map((r, i) => {
        const at = i === head;
        const done = i < head;
        const isHit = i === hit && i <= head;
        return (
          <div key={i} style={{ padding: "8px 22px", fontSize: 32, fontWeight: 700, color: isHit ? colors.limeInk : done ? colors.faint : colors.ink, background: isHit ? "#ecfccb" : at ? "#fef3c7" : "transparent", borderTop: `2px solid ${colors.border}`, display: "flex", justifyContent: "space-between" }}>
            <span>{r}</span>
            <span>{isHit ? "✓" : at ? "◀ read" : done ? "✕" : ""}</span>
          </div>
        );
      })}
    </div>
  );
}

// A B-tree drawn three levels deep; `path` = the child index taken at each level, lit `lit` levels so far.
export function IndexTree({ x, y, w = 520, keys, path, lit, label }: { x: number; y: number; w?: number; keys: string[][]; path: number[]; lit: number; label?: string }) {
  const levelH = 170;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: keys.length * levelH }}>
      <svg width={w} height={keys.length * levelH} style={{ position: "absolute", inset: 0 }}>
        {keys.slice(1).map((row, L) => {
          const n = row.length;
          const parentN = keys[L].length;
          return row.map((_, i) => {
            const px = ((path[L] + 0.5) / parentN) * w;
            const cx = ((i + 0.5) / n) * w;
            const on = L + 1 < lit && i === path[L + 1];
            return <line key={`${L}-${i}`} x1={px} y1={L * levelH + 70} x2={cx} y2={(L + 1) * levelH + 10} stroke={on ? colors.blue : colors.border} strokeWidth={on ? 8 : 4} />;
          });
        })}
      </svg>
      {keys.map((row, L) =>
        row.map((k, i) => {
          const on = L < lit && i === path[L];
          const cw = Math.min(200, w / row.length - 16);
          return (
            <div key={`${L}-${i}`} style={{ position: "absolute", left: ((i + 0.5) / row.length) * w - cw / 2, top: L * levelH + 10, width: cw, height: 64, borderRadius: 14, background: on ? colors.blue : "#fff", color: on ? "#fff" : colors.muted, border: `4px solid ${on ? colors.blue : colors.border}`, display: "grid", placeItems: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 28 }}>
              {k}
            </div>
          );
        }),
      )}
      {label ? <div style={{ position: "absolute", left: 0, right: 0, top: keys.length * levelH - 50, textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 40, color: colors.blue }}>{label}</div> : null}
    </div>
  );
}
