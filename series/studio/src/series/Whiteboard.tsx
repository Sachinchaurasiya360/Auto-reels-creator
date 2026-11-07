import type { ReactNode } from "react";
import { interpolate } from "remotion";
import { fonts } from "./brand";

// Whiteboard scene (2026-11-07, LESSONS 2026-11-06 later: a new visual idea per reel). The candidate draws the
// architecture live with a marker: every mark takes `draw` 0-1 (stroke draws on; text writes left to right).
// Coordinates are inside the board (board-local px). Marker colours are what a real board has.

export const marker = { black: "#1f2937", blue: "#1d4ed8", red: "#dc2626", green: "#15803d" };

export function Whiteboard({ x, y, w, h, children }: { x: number; y: number; w: number; h: number; children?: ReactNode }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* aluminium frame */}
      <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "linear-gradient(160deg,#d6d3d1,#a8a29e 45%,#e7e5e4)", boxShadow: "0 40px 80px -40px rgba(12,10,9,0.5)" }} />
      <div
        style={{
          position: "absolute",
          inset: 12,
          borderRadius: 8,
          overflow: "hidden",
          background: "linear-gradient(170deg,#ffffff 0%,#f8fafc 60%,#eef2f7 100%)",
        }}
      >
        {/* faint ghost of old erased writing, so it reads as a real board */}
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: fonts.hand, fontSize: 60, color: "rgba(100,116,139,0.035)", transform: "rotate(-4deg)" }}>O(n log n) ... DBMS unit 3</div>
        <div style={{ position: "absolute", inset: 0 }}>{children}</div>
      </div>
      {/* marker tray */}
      <div style={{ position: "absolute", left: "12%", right: "12%", bottom: -22, height: 22, borderRadius: "0 0 10px 10px", background: "#a8a29e" }} />
    </div>
  );
}

const len = (pts: [number, number][]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);

// a hand-drawn box: slightly uneven corners, drawn as one stroke, label written inside
export function InkBox({ x, y, w, h, draw = 1, color = marker.black, label, sub, fill, size = 46, cross = 0 }: { x: number; y: number; w: number; h: number; draw?: number; color?: string; label?: string; sub?: string; fill?: string; size?: number; cross?: number }) {
  const pts: [number, number][] = [
    [x + 4, y + 2],
    [x + w - 2, y + 5],
    [x + w + 2, y + h - 3],
    [x + 3, y + h + 1],
    [x + 2, y + 6],
  ];
  const L = len(pts);
  const d = "M" + pts.map((p) => p.join(" ")).join(" L");
  const fillOp = interpolate(draw, [0.8, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        {fill ? <rect x={x + 4} y={y + 4} width={w - 4} height={h - 4} fill={fill} opacity={fillOp} rx={6} /> : null}
        <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - draw)} />
        {cross > 0 ? (
          <g stroke={marker.red} strokeWidth={9} strokeLinecap="round">
            <path d={`M${x + 10} ${y + 10} L${x + w - 10} ${y + h - 10}`} strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - Math.min(1, cross * 2))} />
            <path d={`M${x + w - 10} ${y + 10} L${x + 10} ${y + h - 10}`} strokeDasharray={w + h} strokeDashoffset={(w + h) * (1 - Math.max(0, cross * 2 - 1))} />
          </g>
        ) : null}
      </svg>
      {label ? (
        <InkText x={x + w / 2} y={y + h / 2 - (sub ? size * 0.42 : 0)} draw={interpolate(draw, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} color={color} size={size} center>
          {label}
        </InkText>
      ) : null}
      {sub ? (
        <InkText x={x + w / 2} y={y + h / 2 + size * 0.5} draw={interpolate(draw, [0.7, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} color={marker.blue} size={size * 0.62} center>
          {sub}
        </InkText>
      ) : null}
    </>
  );
}

// marker text that "writes" left to right (clip reveal), centred on x when `center`
export function InkText({ x, y, children, draw = 1, color = marker.black, size = 48, center = false, rotate = 0 }: { x: number; y: number; children: ReactNode; draw?: number; color?: string; size?: number; center?: boolean; rotate?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${center ? "-50%" : "0"}, -50%) rotate(${rotate}deg)`,
        fontFamily: fonts.hand,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1,
        color,
        whiteSpace: "nowrap",
        clipPath: `inset(-20% ${100 - draw * 100}% -20% -5%)`,
      }}
    >
      {children}
    </div>
  );
}

// marker arrow a -> b with a slight bow, head appears at the end of the stroke; optional label on the shaft
export function InkArrow({ from, to, draw = 1, color = marker.black, bow = 0.08, label, labelSize = 38, dashed = false }: { from: [number, number]; to: [number, number]; draw?: number; color?: string; bow?: number; label?: string; labelSize?: number; dashed?: boolean }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2 - (y2 - y1) * bow;
  const my = (y1 + y2) / 2 + (x2 - x1) * bow;
  const L = Math.hypot(x2 - x1, y2 - y1) * 1.05;
  const ang = Math.atan2(y2 - my, x2 - mx);
  const head = 22;
  const hd = `M${x2 - head * Math.cos(ang - 0.45)} ${y2 - head * Math.sin(ang - 0.45)} L${x2} ${y2} L${x2 - head * Math.cos(ang + 0.45)} ${y2 - head * Math.sin(ang + 0.45)}`;
  const headOp = draw > 0.92 ? 1 : 0;
  return (
    <>
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
        <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray={dashed ? "14 12" : L} strokeDashoffset={dashed ? 0 : L * (1 - draw)} opacity={dashed ? draw : 1} />
        <path d={hd} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" opacity={headOp} />
      </svg>
      {label ? (
        <InkText x={mx} y={my - 26} draw={interpolate(draw, [0.6, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} color={color} size={labelSize} center>
          {label}
        </InkText>
      ) : null}
    </>
  );
}

// marker circle/loop around a point (emphasis), drawn on
export function InkCircle({ cx, cy, rx, ry, draw = 1, color = marker.red }: { cx: number; cy: number; rx: number; ry: number; draw?: number; color?: string }) {
  const L = Math.PI * (rx + ry) * 1.1;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1} height={1}>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={color} strokeWidth={6} strokeDasharray={L} strokeDashoffset={L * (1 - draw)} transform={`rotate(-6 ${cx} ${cy})`} />
    </svg>
  );
}
