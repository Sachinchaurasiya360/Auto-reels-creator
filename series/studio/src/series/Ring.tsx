import { colors, fonts } from "./brand";
import { looks, Person } from "./People";

// Consistent-hashing scene (2026-11-05, Mock Interview Part 7): a gol ring road (the hash ring) with numbered houses
// (keys / parcels) around it and delivery boys (servers) standing on it. Two rules for "whose house is it":
//  - modulo: house number % boys.length (positions on the ring don't matter);
//  - ring: walk clockwise from the house to the first boy (owner arcs drawn on the road).
// A boy may stand at several spots (virtual nodes): give him several angles. Angles are degrees, 0 = top, clockwise.

export type RingBoy = { name: string; color: string; angles: number[]; enter?: number }; // enter 0-1 (scale in)
export type RingRule = "modulo" | "ring";

const rad = (a: number) => (a * Math.PI) / 180;
export const ringPoint = (cx: number, cy: number, r: number, a: number) => ({ x: cx + r * Math.sin(rad(a)), y: cy - r * Math.cos(rad(a)) });

// owner boy index for a house at angle `a` with number `n`
export function ringOwner(rule: RingRule, boys: RingBoy[], n: number, a: number): number {
  if (rule === "modulo") return n % boys.length;
  let best = -1;
  let bestD = Infinity;
  boys.forEach((b, i) =>
    b.angles.forEach((ba) => {
      const d = (((ba - a) % 360) + 360) % 360; // clockwise distance from the house to this spot
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }),
  );
  return best;
}

export function HashRing({
  cx,
  cy,
  r,
  houses,
  boys,
  rule,
  moved = [],
  arcs = 0,
  boySize = 92,
  showNums = true,
}: {
  cx: number;
  cy: number;
  r: number;
  houses: number; // houses 0..houses-1, evenly around the ring
  boys: RingBoy[];
  rule: RingRule;
  moved?: number[]; // house numbers to mark as "moved to a new boy" (red ring)
  arcs?: number; // 0-1 opacity of the owner arcs on the road (ring rule)
  boySize?: number;
  showNums?: boolean;
}) {
  const spots = boys.flatMap((b, i) => b.angles.map((a) => ({ a, i })));
  const sorted = [...spots].sort((p, q) => p.a - q.a);
  const road = 46;
  return (
    <>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {/* the road */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3f3f46" strokeWidth={road} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#fafaf9" strokeWidth={4} strokeDasharray="18 22" opacity={0.6} />
        {/* owner arcs: each spot owns the stretch counter-clockwise back to the previous spot */}
        {arcs > 0 && rule === "ring"
          ? sorted.map((s, k) => {
              const prev = sorted[(k - 1 + sorted.length) % sorted.length].a;
              const from = prev;
              let to = s.a;
              if (to <= from) to += 360;
              const large = to - from > 180 ? 1 : 0;
              const p0 = ringPoint(cx, cy, r, from);
              const p1 = ringPoint(cx, cy, r, to);
              return (
                <path key={k} d={`M${p0.x} ${p0.y} A ${r} ${r} 0 ${large} 1 ${p1.x} ${p1.y}`} fill="none" stroke={boys[s.i].color} strokeWidth={road - 14} opacity={arcs * 0.85} strokeLinecap="butt" />
              );
            })
          : null}
      </svg>
      {/* houses with their parcel numbers, tagged in the owner's colour */}
      {Array.from({ length: houses }, (_, n) => {
        const a = (n / houses) * 360;
        const owner = ringOwner(rule, boys, n, a);
        const p = ringPoint(cx, cy, r + 58, a);
        const hit = moved.includes(n);
        return (
          <div key={n} style={{ position: "absolute", left: p.x - 30, top: p.y - 30, width: 60, height: 60, borderRadius: 16, background: owner >= 0 ? boys[owner].color : colors.surface, border: `4px solid ${colors.ink}`, display: "grid", placeItems: "center", boxShadow: hit ? `0 0 0 7px ${colors.red}` : `3px 3px 0 ${colors.ink}`, transform: `scale(${hit ? 1.12 : 1})` }}>
            {showNums ? <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 26, color: "#fff", textShadow: `0 2px 0 ${colors.ink}` }}>{n}</span> : null}
          </div>
        );
      })}
      {/* the boys: the first spot gets the drawn person, extra spots (virtual nodes) a coloured marker */}
      {boys.map((b, i) =>
        b.angles.map((a, k) => {
          const p = ringPoint(cx, cy, r, a);
          const e = b.enter ?? 1;
          if (k > 0)
            return (
              <div key={`${i}-${k}`} style={{ position: "absolute", left: p.x - 17, top: p.y - 17, width: 34, height: 34, borderRadius: 99, background: b.color, border: `4px solid ${colors.ink}`, transform: `scale(${e})` }} />
            );
          return (
            <div key={`${i}-0`} style={{ position: "absolute", left: p.x - boySize / 2, top: p.y - boySize * 0.9, transform: `scale(${e})`, transformOrigin: "50% 90%" }}>
              <Person look={{ ...looks.rider, shirt: b.color }} size={boySize} />
              <div style={{ position: "absolute", left: "50%", top: boySize + 2, transform: "translateX(-50%)", fontFamily: fonts.display, fontWeight: 700, fontSize: 26, color: colors.ink, background: colors.surface, border: `3px solid ${colors.ink}`, borderRadius: 10, padding: "0 10px", whiteSpace: "nowrap" }}>
                {b.name}
              </div>
            </div>
          );
        }),
      )}
    </>
  );
}
