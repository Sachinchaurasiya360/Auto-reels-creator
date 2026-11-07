import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// Surge-pricing scene (2026-11-07): a dark city map cut into H3-style flat-top hexagons, each tinted by its surge
// "heat" 0-1 (driver-app heat map: clear -> light orange -> dark red), cars as dots, a rider pin and a venue.
// Everything is in map-local px; place the map with x/y/w/h. `heat(col,row)` gives each cell's heat.

export type HexCell = { col: number; row: number; cx: number; cy: number };

export function hexCells(w: number, h: number, r: number): HexCell[] {
  const dx = r * 1.5;
  const dy = r * Math.sqrt(3);
  const out: HexCell[] = [];
  for (let col = -1; col * dx < w + r; col++) {
    for (let row = -1; row * dy < h + dy; row++) {
      out.push({ col, row, cx: col * dx, cy: row * dy + (col % 2 !== 0 ? dy / 2 : 0) });
    }
  }
  return out;
}

const hexPath = (cx: number, cy: number, r: number) =>
  "M" +
  Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" L") +
  "Z";

export const heatColor = (h: number) => {
  // 0 clear, 0.35 light orange, 0.7 orange-red, 1 deep red (Uber driver heat map, light orange to dark red)
  if (h < 0.08) return "rgba(0,0,0,0)";
  const stops: [number, [number, number, number]][] = [
    [0.08, [253, 186, 116]],
    [0.45, [249, 115, 22]],
    [0.75, [220, 38, 38]],
    [1, [153, 27, 27]],
  ];
  let i = 0;
  while (i < stops.length - 2 && h > stops[i + 1][0]) i++;
  const [a, ca] = stops[i];
  const [b, cb] = stops[i + 1];
  const k = Math.min(1, Math.max(0, (h - a) / (b - a)));
  const c = ca.map((v, j) => Math.round(v + (cb[j] - v) * k));
  return `rgba(${c[0]},${c[1]},${c[2]},${0.42 + 0.5 * Math.min(1, h)})`;
};

// deterministic road network so every frame and every reel draws the same city
function Roads({ w, h }: { w: number; h: number }) {
  const lines: ReactNode[] = [];
  for (let i = 0; i < 9; i++) {
    const y = (h / 9) * i + ((i * 37) % 50);
    lines.push(<path key={`h${i}`} d={`M0 ${y} C${w * 0.3} ${y + 30 - (i % 3) * 25} ${w * 0.6} ${y - 20} ${w} ${y + 15}`} stroke={i % 4 === 0 ? "#334155" : "#1e293b"} strokeWidth={i % 4 === 0 ? 14 : 6} fill="none" />);
  }
  for (let i = 0; i < 7; i++) {
    const x = (w / 7) * i + ((i * 53) % 70);
    lines.push(<path key={`v${i}`} d={`M${x} 0 C${x + 40} ${h * 0.35} ${x - 30} ${h * 0.65} ${x + 10} ${h}`} stroke={i % 3 === 0 ? "#334155" : "#1e293b"} strokeWidth={i % 3 === 0 ? 14 : 6} fill="none" />);
  }
  return <>{lines}</>;
}

export function HexMap({
  x,
  y,
  w,
  h,
  r = 70,
  heat,
  focus,
  grid = 1,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  heat: (c: HexCell) => number;
  focus?: { col: number; row: number }; // ringed cell
  grid?: number; // 0-1: hex outlines fade in
  children?: ReactNode; // overlays in map-local px (cars, pins)
}) {
  const cells = hexCells(w, h, r);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 36, overflow: "hidden", background: "#0b1220", boxShadow: "0 40px 90px -40px rgba(0,0,0,0.7)" }}>
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        <Roads w={w} h={h} />
        {cells.map((c) => (
          <path key={`${c.col},${c.row}`} d={hexPath(c.cx, c.cy, r - 2)} fill={heatColor(heat(c))} stroke={`rgba(148,163,184,${0.35 * grid})`} strokeWidth={2} />
        ))}
        {focus
          ? cells
              .filter((c) => c.col === focus.col && c.row === focus.row)
              .map((c) => <path key="f" d={hexPath(c.cx, c.cy, r - 2)} fill="none" stroke="#fde68a" strokeWidth={7} />)
          : null}
      </svg>
      {children}
    </div>
  );
}

export const cellCenter = (col: number, row: number, r = 70) => {
  const dy = r * Math.sqrt(3);
  return { x: col * r * 1.5, y: row * dy + (col % 2 !== 0 ? dy / 2 : 0) };
};

// a car seen from above (driver available = white, on trip = grey)
export const CarDot = ({ x, y, rot = 0, busy = false }: { x: number; y: number; rot?: number; busy?: boolean }) => (
  <div style={{ position: "absolute", left: x - 13, top: y - 20, width: 26, height: 40, borderRadius: 9, background: busy ? "#64748b" : "#f8fafc", transform: `rotate(${rot}deg)`, boxShadow: "0 0 14px rgba(248,250,252,0.55)" }}>
    <div style={{ position: "absolute", left: 4, right: 4, top: 7, height: 9, borderRadius: 3, background: "#0f172a" }} />
  </div>
);

// rider: blue location pin with pulse
export const RiderPin = ({ x, y, label }: { x: number; y: number; label?: string }) => (
  <div style={{ position: "absolute", left: x, top: y }}>
    <div style={{ position: "absolute", left: -34, top: -34, width: 68, height: 68, borderRadius: 34, background: "rgba(0,116,255,0.25)" }} />
    <div style={{ position: "absolute", left: -16, top: -16, width: 32, height: 32, borderRadius: 16, background: colors.blue, border: "5px solid #fff" }} />
    {label ? <div style={{ position: "absolute", left: 26, top: -22, fontFamily: fonts.display, fontWeight: 700, fontSize: 32, color: "#fff", whiteSpace: "nowrap" }}>{label}</div> : null}
  </div>
);

// concert venue glyph: a stadium bowl with stage lights
export const Venue = ({ x, y, label = "Concert" }: { x: number; y: number; label?: string }) => (
  <div style={{ position: "absolute", left: x - 90, top: y - 60, width: 180, height: 120 }}>
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 45%,#fde68a 0%,#a855f7 35%,#312e81 70%)", border: "6px solid #e9d5ff", boxShadow: "0 0 50px rgba(168,85,247,0.8)" }} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 128, textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: "#f5f3ff" }}>{label}</div>
  </div>
);
