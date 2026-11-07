import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// Railway handover scene (2026-11-07, Real Life SD Part 9): a night side view of a train crossing cell towers.
// World units are px along the track; `cam` is the world x at the band's left edge. Everything is driven by props,
// so a reel animates it from reel-time. Also: SignalMeter (serving vs neighbour RSRP with the A3 line) and BarChart.

export type RailTower = { id: string; x: number; label?: string };

const BAND_W = 1080;
const BAND_H = 720;
const TRACK_Y = 590;
const TOWER_TOP = 170;

function lerp(a: number, b: number, p: number) {
  return a + (b - a) * p;
}

function TowerGlyph({ x, tone, glow }: { x: number; tone: string; glow: number }) {
  const h = TRACK_Y - TOWER_TOP - 20;
  return (
    <g transform={`translate(${x},${TOWER_TOP})`}>
      <path d={`M-34 ${h} L-6 0 L6 0 L34 ${h}`} fill="none" stroke={tone} strokeWidth={6} strokeLinejoin="round" />
      {[0.25, 0.5, 0.75].map((f) => (
        <path key={f} d={`M${-6 - 28 * f} ${h * f} L${6 + 28 * f} ${h * f}`} stroke={tone} strokeWidth={4} />
      ))}
      <path d={`M-20 ${h * 0.5} L${6 + 28 * 0.75} ${h * 0.75} M20 ${h * 0.5} L${-6 - 28 * 0.75} ${h * 0.75}`} stroke={tone} strokeWidth={3} opacity={0.7} />
      <rect x={-16} y={-34} width={10} height={44} rx={3} fill={tone} />
      <rect x={6} y={-34} width={10} height={44} rx={3} fill={tone} />
      <circle cx={0} cy={-46} r={9 + glow * 5} fill={tone} opacity={0.5 + 0.5 * glow} />
    </g>
  );
}

function Train({ x, len = 520, speedBlur = 0 }: { x: number; len?: number; speedBlur?: number }) {
  const cars = Math.round(len / 175);
  return (
    <g transform={`translate(${x - len},${TRACK_Y - 96})`}>
      {Array.from({ length: cars }).map((_, i) => {
        const cx = i * 175;
        const head = i === cars - 1;
        return (
          <g key={i}>
            <path
              d={head ? `M${cx} 10 Q${cx} 0 ${cx + 10} 0 L${cx + 120} 0 Q${cx + 170} 6 ${cx + 172} 70 L${cx + 172} 84 L${cx} 84 Z` : `M${cx} 10 Q${cx} 0 ${cx + 10} 0 L${cx + 160} 0 Q${cx + 170} 0 ${cx + 170} 10 L${cx + 170} 84 L${cx} 84 Z`}
              fill="#e7e5e4"
            />
            <rect x={cx} y={54} width={head ? 172 : 170} height={10} fill={colors.blue} />
            {Array.from({ length: head ? 3 : 5 }).map((__, w) => (
              <rect key={w} x={cx + 14 + w * 30} y={16} width={22} height={26} rx={4} fill="#fde68a" opacity={0.9} />
            ))}
            {head ? <path d={`M${cx + 120} 12 Q${cx + 150} 16 ${cx + 160} 44 L${cx + 120} 44 Z`} fill="#1e293b" /> : null}
            <circle cx={cx + 34} cy={90} r={9} fill="#1c1917" />
            <circle cx={cx + 136} cy={90} r={9} fill="#1c1917" />
          </g>
        );
      })}
      {speedBlur > 0
        ? [10, 30, 50, 70].map((yy) => <rect key={yy} x={-160 * speedBlur} y={yy} width={140 * speedBlur} height={3} fill="#e7e5e4" opacity={0.35 * speedBlur} />)
        : null}
    </g>
  );
}

function Env({ x, y, s = 1, tone = "#fff" }: { x: number; y: number; s?: number; tone?: string }) {
  return (
    <g transform={`translate(${x - 22 * s},${y - 15 * s}) scale(${s})`}>
      <rect width={44} height={30} rx={4} fill={tone} stroke={colors.ink} strokeWidth={2} />
      <path d="M2 3 L22 18 L42 3" fill="none" stroke={colors.ink} strokeWidth={2} />
    </g>
  );
}

export function RailStrip({
  y = 580,
  cam,
  trainX,
  towers,
  serving,
  target,
  x2 = 0,
  report = 0,
  command = 0,
  packets = 0,
  tunnel,
  leaky = 0,
  dark = 0,
  dropped = 0,
  speedBlur = 0,
  phoneLabel,
  children,
}: {
  y?: number;
  cam: number;
  trainX: number;
  towers: RailTower[];
  serving?: string;
  target?: string;
  x2?: number; // 0-1 draws the X2 link serving -> target
  report?: number; // 0-1 measurement report: phone -> serving tower
  command?: number; // 0-1 handover command: serving tower -> phone
  packets?: number; // 0-1 forwarded voice packets serving -> target over X2
  tunnel?: { from: number; to: number };
  leaky?: number; // 0-1 leaky-feeder cable glow inside the tunnel
  dark?: number; // 0-1 extra darkness (inside the tunnel)
  dropped?: number; // 0-1 red X over the phone
  speedBlur?: number;
  phoneLabel?: string; // e.g. "call 02:14"
  children?: ReactNode;
}) {
  const sx = (wx: number) => wx - cam;
  const byId = (id?: string) => towers.find((tw) => tw.id === id);
  const sv = byId(serving);
  const tg = byId(target);
  const phone = { x: sx(trainX) - 120, y: TRACK_Y - 150 };
  const towerTop = (tw: RailTower) => ({ x: sx(tw.x), y: TOWER_TOP - 46 });
  return (
    <div style={{ position: "absolute", left: 0, top: y, width: BAND_W, height: BAND_H, overflow: "hidden", borderRadius: 0 }}>
      <svg width={BAND_W} height={BAND_H} viewBox={`0 0 ${BAND_W} ${BAND_H}`}>
        <defs>
          <linearGradient id="rail-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b1020" />
            <stop offset="1" stopColor="#1f2a4a" />
          </linearGradient>
          <radialGradient id="rail-cell-blue">
            <stop offset="0" stopColor={colors.blue} stopOpacity={0.35} />
            <stop offset="1" stopColor={colors.blue} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="rail-cell-amber">
            <stop offset="0" stopColor={colors.amber} stopOpacity={0.32} />
            <stop offset="1" stopColor={colors.amber} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="rail-cell-faint">
            <stop offset="0" stopColor="#94a3b8" stopOpacity={0.12} />
            <stop offset="1" stopColor="#94a3b8" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={BAND_W} height={BAND_H} fill="url(#rail-sky)" />
        {/* distant hills, slow parallax */}
        <path d={`M0 ${TRACK_Y - 40} ${Array.from({ length: 14 }).map((_, i) => `Q${i * 120 + 60 - ((cam * 0.2) % 120)} ${TRACK_Y - 120 - (i % 3) * 30} ${i * 120 + 120 - ((cam * 0.2) % 120)} ${TRACK_Y - 40}`).join(" ")} L${BAND_W} ${BAND_H} L0 ${BAND_H} Z`} fill="#16203a" />
        {/* coverage + towers */}
        {towers.map((tw) => {
          const isS = tw.id === serving;
          const isT = tw.id === target;
          return <ellipse key={`c-${tw.id}`} cx={sx(tw.x)} cy={TRACK_Y - 60} rx={360} ry={300} fill={`url(#rail-cell-${isS ? "blue" : isT ? "amber" : "faint"})`} />;
        })}
        {towers.map((tw) => {
          const isS = tw.id === serving;
          const isT = tw.id === target;
          return <TowerGlyph key={tw.id} x={sx(tw.x)} tone={isS ? "#60a5fa" : isT ? "#fbbf24" : "#64748b"} glow={isS || isT ? 1 : 0} />;
        })}
        {towers.map((tw) =>
          tw.label ? (
            <text key={`l-${tw.id}`} x={sx(tw.x)} y={TRACK_Y + 70} textAnchor="middle" fontFamily={fonts.mono} fontSize={26} fill="#cbd5e1">
              {tw.label}
            </text>
          ) : null,
        )}
        {/* X2 link */}
        {sv && tg && x2 > 0 ? (
          <path
            d={`M${towerTop(sv).x} ${towerTop(sv).y} Q${(towerTop(sv).x + towerTop(tg).x) / 2} ${towerTop(sv).y - 110} ${towerTop(tg).x} ${towerTop(tg).y}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={5}
            strokeDasharray="14 10"
            pathLength={1}
            strokeDashoffset={0}
            opacity={x2}
          />
        ) : null}
        {sv && tg && packets > 0
          ? [0, 0.18, 0.36].map((d) => {
              const p = Math.min(1, Math.max(0, packets * 1.5 - d));
              if (p <= 0 || p >= 1) return null;
              const a = towerTop(sv);
              const b = towerTop(tg);
              const mx = (a.x + b.x) / 2;
              const my = a.y - 110;
              const px = (1 - p) * (1 - p) * a.x + 2 * (1 - p) * p * mx + p * p * b.x;
              const py = (1 - p) * (1 - p) * a.y + 2 * (1 - p) * p * my + p * p * b.y;
              return <circle key={d} cx={px} cy={py} r={13} fill={colors.lime} />;
            })
          : null}
        {/* tunnel */}
        {tunnel ? (
          <g>
            <rect x={sx(tunnel.from)} y={TRACK_Y - 230} width={tunnel.to - tunnel.from} height={260} fill="#0a0a0a" />
            <path d={`M${sx(tunnel.from)} ${TRACK_Y - 230} Q${sx(tunnel.from) - 60} ${TRACK_Y - 330} ${sx(tunnel.from) + 120} ${TRACK_Y - 300} L${sx(tunnel.to) - 120} ${TRACK_Y - 300} Q${sx(tunnel.to) + 60} ${TRACK_Y - 330} ${sx(tunnel.to)} ${TRACK_Y - 230} Z`} fill="#3f3f46" />
          </g>
        ) : null}
        {/* track */}
        <rect x={0} y={TRACK_Y} width={BAND_W} height={10} fill="#78716c" />
        {Array.from({ length: 30 }).map((_, i) => (
          <rect key={i} x={i * 40 - (cam % 40)} y={TRACK_Y + 10} width={18} height={8} fill="#57534e" />
        ))}
        <Train x={sx(trainX)} speedBlur={speedBlur} />
        {/* tunnel front wall covers the train inside */}
        {tunnel ? <rect x={sx(tunnel.from)} y={TRACK_Y - 230} width={tunnel.to - tunnel.from} height={240} fill="#0a0a0a" opacity={0.92 - 0.5 * leaky} /> : null}
        {tunnel ? (
          <g>
            {leaky > 0 ? <rect x={sx(tunnel.from)} y={TRACK_Y - 214} width={tunnel.to - tunnel.from} height={8} rx={4} fill={colors.lime} opacity={leaky} /> : null}
            {leaky > 0
              ? Array.from({ length: Math.ceil((tunnel.to - tunnel.from) / 90) }).map((_, i) => (
                  <path key={i} d={`M${sx(tunnel.from) + 45 + i * 90} ${TRACK_Y - 200} q-14 22 0 44 m28 -44 q14 22 0 44`} fill="none" stroke={colors.lime} strokeWidth={3} opacity={leaky * 0.7} />
                ))
              : null}
          </g>
        ) : null}
        {dark > 0 ? <rect width={BAND_W} height={BAND_H} fill="#000" opacity={dark * 0.55} /> : null}
        {/* phone bubble above the train */}
        <g transform={`translate(${phone.x},${phone.y})`}>
          <rect x={-70} y={-62} width={140} height={78} rx={18} fill="#fff" />
          <text x={0} y={-12} textAnchor="middle" fontFamily={fonts.mono} fontSize={26} fontWeight={700} fill={dropped > 0.5 ? colors.red : colors.limeInk}>
            {dropped > 0.5 ? "dropped" : phoneLabel ?? "📞 call"}
          </text>
          <path d="M-10 16 L0 34 L10 16 Z" fill="#fff" />
          {dropped > 0 ? <path d="M-40 -60 L40 10 M40 -60 L-40 10" stroke={colors.red} strokeWidth={10} strokeLinecap="round" opacity={dropped} /> : null}
        </g>
        {/* measurement report: phone -> serving */}
        {sv && report > 0 && report < 1 ? <Env x={lerp(phone.x, towerTop(sv).x, report)} y={lerp(phone.y - 30, towerTop(sv).y + 40, report) - Math.sin(report * Math.PI) * 80} s={1.4} /> : null}
        {/* handover command: target -> phone */}
        {tg && command > 0 && command < 1 ? <Env x={lerp(towerTop(tg).x, phone.x, command)} y={lerp(towerTop(tg).y + 40, phone.y - 30, command) - Math.sin(command * Math.PI) * 80} s={1.4} tone="#fde68a" /> : null}
      </svg>
      {children}
    </div>
  );
}

export function SignalMeter({ serving, neighbour, offset = 0.08, a3 = 0, x = 90, y = 1320, w = 900 }: { serving: number; neighbour: number; offset?: number; a3?: number; x?: number; y?: number; w?: number }) {
  const bar = (v: number, tone: string, label: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
      <div style={{ width: 210, fontFamily: fonts.mono, fontSize: 28, color: "#e2e8f0" }}>{label}</div>
      <div style={{ flex: 1, height: 34, borderRadius: 17, background: "#334155", position: "relative", overflow: "hidden" }}>
        <div style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%`, height: "100%", background: tone }} />
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "22px 28px", borderRadius: 24, background: "rgba(15,23,42,0.94)", border: "2px solid #334155" }}>
      <div style={{ fontFamily: fonts.mono, fontSize: 26, color: "#94a3b8", marginBottom: 12 }}>RSRP · signal strength</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bar(serving, "#60a5fa", "serving")}
        {bar(neighbour, "#fbbf24", "neighbour")}
      </div>
      <div style={{ marginTop: 12, fontFamily: fonts.mono, fontSize: 24, color: a3 > 0 ? colors.lime : "#94a3b8" }}>
        {a3 > 0 ? "✓ neighbour > serving + offset · Event A3" : `A3 when neighbour > serving + ${Math.round(offset * 100)}%`}
      </div>
    </div>
  );
}

export function BarChart({ bars, benchmark, grow = 1, x = 90, y = 640, w = 900, max }: { bars: { label: string; value: number; tone?: string }[]; benchmark?: { value: number; label: string }; grow?: number; x?: number; y?: number; w?: number; max: number }) {
  const H = 420;
  const bw = (w - 80) / bars.length;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: H + 120, background: "#fff", borderRadius: 26, border: `3px solid ${colors.border}`, boxShadow: "0 30px 60px -30px rgba(12,10,9,0.4)" }}>
      <div style={{ position: "absolute", left: 40, right: 40, top: 30, height: H }}>
        {benchmark ? (
          <div style={{ position: "absolute", left: 0, right: 0, top: H - (benchmark.value / max) * H, borderTop: `4px dashed ${colors.red}` }}>
            <span style={{ position: "absolute", right: 0, top: -40, fontFamily: fonts.mono, fontSize: 26, color: colors.red, fontWeight: 700 }}>{benchmark.label}</span>
          </div>
        ) : null}
        {bars.map((b, i) => {
          const h = Math.max(6, (b.value / max) * H * grow);
          return (
            <div key={b.label} style={{ position: "absolute", left: i * bw + bw * 0.18, width: bw * 0.64, bottom: 0, height: h, background: b.tone ?? colors.ink, borderRadius: "12px 12px 0 0" }}>
              <div style={{ position: "absolute", top: -50, width: "100%", textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 40, opacity: grow }}>{(b.value * grow).toFixed(b.value % 1 ? 2 : 0)}%</div>
            </div>
          );
        })}
      </div>
      {bars.map((b, i) => (
        <div key={b.label} style={{ position: "absolute", left: 40 + i * bw, width: bw, top: H + 46, textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 36 }}>
          {b.label}
        </div>
      ))}
    </div>
  );
}
