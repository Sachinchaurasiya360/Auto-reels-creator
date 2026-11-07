import { colors, fonts } from "./brand";

// Live-traffic scene pieces (2026-11-05, Real Life System Design Part 7: Google Maps traffic).
// `TrafficRoad`: a top-down road cut into "tukde" (segments); each segment is coloured by its speed against the usual
// speed (Google's 4 levels: green / orange / red / dark red), and the phones on it ride along showing their speed.
// `MapLine`: the same colouring as a route line inside a phone's map. `PhoneCart`: a hand-cart full of phones (the
// Weckert Berlin stunt), drawn from the same phone glyph so it reads as "more phones", not a new object.

export type TrafficLevel = "green" | "orange" | "red" | "darkred";
export const trafficColors: Record<TrafficLevel, string> = { green: "#22c55e", orange: "#f59e0b", red: "#ef4444", darkred: "#991b1b" };
// ratio = today's average speed / the usual speed for that road and hour. Google publishes no thresholds; these are
// only for drawing.
export const levelFor = (ratio: number): TrafficLevel => (ratio > 0.7 ? "green" : ratio > 0.45 ? "orange" : ratio > 0.2 ? "red" : "darkred");

export type RoadPhone = { pos: number; kmh: number; lane?: 0 | 1; tag?: boolean };

// A small phone glyph (top-down marker for a phone moving on the road).
export function PhoneGlyph({ size = 34, color = colors.ink, screen = colors.blue }: { size?: number; color?: string; screen?: string }) {
  return (
    <svg width={size * 0.6} height={size} viewBox="0 0 30 50">
      <rect x={1} y={1} width={28} height={48} rx={6} fill={color} />
      <rect x={4} y={6} width={22} height={34} rx={2} fill={screen} />
      <circle cx={15} cy={44} r={2.2} fill="#a8a29e" />
    </svg>
  );
}

export function TrafficRoad({
  x,
  y,
  w,
  h = 150,
  segments,
  phones = [],
  labels = true,
  highlight,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  segments: number[]; // speed ratio per segment (1 = usual speed); NaN = no data (grey)
  phones?: RoadPhone[]; // pos 0-1 along the road
  labels?: boolean;
  highlight?: number; // segment index to ring
}) {
  const n = segments.length;
  const sw = w / n;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h }}>
      {/* asphalt */}
      <div style={{ position: "absolute", inset: 0, background: "#3f3f46", borderRadius: 18, boxShadow: "0 24px 50px -24px rgba(12,10,9,0.5)" }} />
      {/* lane line */}
      <div style={{ position: "absolute", left: 16, right: 16, top: h / 2 - 3, height: 6, backgroundImage: "repeating-linear-gradient(90deg,#fafaf9 0 34px,transparent 34px 64px)", opacity: 0.6 }} />
      {/* the Maps colour of each tukda, as a thick band on the road's edge */}
      {segments.map((r, i) => {
        const c = Number.isNaN(r) ? "#a8a29e" : trafficColors[levelFor(r)];
        return (
          <div key={i} style={{ position: "absolute", left: i * sw + 4, width: sw - 8, top: -26, height: 22, borderRadius: 11, background: c, border: `3px solid ${colors.ink}`, boxShadow: highlight === i ? `0 0 0 8px ${colors.amber}88` : undefined }} />
        );
      })}
      {/* segment cuts */}
      {Array.from({ length: n - 1 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: (i + 1) * sw - 2, top: -8, height: h + 16, width: 4, backgroundImage: `repeating-linear-gradient(180deg,${colors.amber} 0 10px,transparent 10px 18px)` }} />
      ))}
      {labels
        ? segments.map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * sw, width: sw, top: h + 10, textAlign: "center", fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: highlight === i ? colors.ink : colors.muted }}>
              tukda {i + 1}
            </div>
          ))
        : null}
      {phones.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: p.pos * w - 12, top: (p.lane ?? i % 2) === 0 ? h * 0.12 : h * 0.55, display: "flex", alignItems: "center", gap: 6 }}>
          <PhoneGlyph size={46} color="#e7e5e4" screen={p.kmh < 10 ? colors.red : colors.blue} />
          {p.tag ? (
            <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: "#fff", background: colors.ink, borderRadius: 8, padding: "2px 8px", whiteSpace: "nowrap" }}>{p.kmh} km/h</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

// The route line inside a phone's map: a polyline whose stretches take traffic colours.
export function MapLine({ w, h, points, levels, width = 16 }: { w: number; h: number; points: [number, number][]; levels: TrafficLevel[]; width?: number }) {
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      {points.slice(1).map((p, i) => (
        <line key={i} x1={points[i][0]} y1={points[i][1]} x2={p[0]} y2={p[1]} stroke={trafficColors[levels[Math.min(i, levels.length - 1)]]} strokeWidth={width} strokeLinecap="round" />
      ))}
    </svg>
  );
}

// A hand-cart (thela) piled with phones: Simon Weckert's 99 phones, Berlin 2019/2020.
export function PhoneCart({ x, y, w = 260, count = 99 }: { x: number; y: number; w?: number; count?: number }) {
  const s = w / 260;
  const shown = 24;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: 190 * s }}>
      <svg width={w} height={190 * s} viewBox="0 0 260 190" style={{ position: "absolute", inset: 0 }}>
        <path d="M18 70 H232 L218 140 H32 Z" fill="#b45309" stroke={colors.ink} strokeWidth={5} />
        <line x1={232} y1={70} x2={258} y2={40} stroke={colors.ink} strokeWidth={8} strokeLinecap="round" />
        <circle cx={62} cy={156} r={26} fill={colors.ink} />
        <circle cx={192} cy={156} r={26} fill={colors.ink} />
        <circle cx={62} cy={156} r={9} fill="#a8a29e" />
        <circle cx={192} cy={156} r={9} fill="#a8a29e" />
      </svg>
      {Array.from({ length: shown }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: (28 + (i % 8) * 24) * s, top: (14 + Math.floor(i / 8) * 20 - (i % 3) * 4) * s, transform: `rotate(${(i * 37) % 30 - 15}deg)` }}>
          <PhoneGlyph size={34 * s} color="#e7e5e4" screen={colors.red} />
        </div>
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, top: -46 * s, textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 30 * s, color: colors.ink }}>{count} phones 🛒</div>
    </div>
  );
}
