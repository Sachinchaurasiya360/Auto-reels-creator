import type { ReactNode } from "react";
import { evolvePath } from "@remotion/paths";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";

// System-design vocabulary: boxes for the parties (bank, NPCI, server, cache) and links between
// them that draw on and carry packets. Coordinates are frame pixels; everything is frame-driven.

export type NodeState = "idle" | "busy" | "ok" | "fail";

const stateColor: Record<NodeState, string> = {
  idle: colors.faint,
  busy: colors.amber,
  ok: "#22c55e",
  fail: colors.red,
};

export function SysNode({
  x,
  y,
  w = 300,
  title,
  sub,
  icon,
  state = "idle",
  enterAt = 0,
  dark = false,
  highlight = false,
  size = 1,
}: {
  x: number;
  y: number;
  w?: number;
  title: string;
  sub?: string;
  icon?: ReactNode;
  state?: NodeState;
  enterAt?: number;
  dark?: boolean;
  highlight?: boolean;
  size?: number; // scale from the top-left corner; 1.3-1.4 reads on a phone when a scene has only 2-4 nodes (2026-11-10)
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - enterAt, fps, config: { damping: 14, stiffness: 160 } });
  const pulse = state === "busy" ? 0.5 + 0.5 * Math.sin(frame / 3) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "22px 24px",
        borderRadius: 28,
        background: dark ? colors.code : colors.surface,
        color: dark ? "#fff" : colors.ink,
        border: `2px solid ${highlight ? colors.blue : dark ? "#262a33" : colors.border}`,
        boxShadow: highlight
          ? `0 0 0 8px ${colors.blueSoft}, 0 30px 60px -28px rgba(12,10,9,0.35)`
          : "0 30px 60px -28px rgba(12,10,9,0.30)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px) scale(${size * interpolate(enter, [0, 1], [0.9, 1])})`,
        transformOrigin: "0 0",
        fontFamily: fonts.body,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {icon ? (
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: dark ? "#1b1e24" : colors.surfaceAlt,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        ) : null}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: fonts.display, fontSize: 36, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          {sub ? <div style={{ fontSize: 24, color: dark ? "#9ca3af" : colors.muted, marginTop: 4 }}>{sub}</div> : null}
        </div>
        <div
          style={{
            marginLeft: "auto",
            width: 16,
            height: 16,
            borderRadius: 999,
            background: stateColor[state],
            opacity: pulse,
            boxShadow: `0 0 0 6px ${stateColor[state]}22`,
            flexShrink: 0,
          }}
        />
      </div>
    </div>
  );
}

export type Pt = { x: number; y: number };

// A curved link that draws on from `drawAt`, then carries packets: each packet starts at its frame
// and travels the path in `travel` frames. `reverse` sends it back from `to` to `from`.
export function Link({
  from,
  to,
  bend = 0.25,
  drawAt = 0,
  drawFor = 12,
  packets = [],
  travel = 18,
  color = colors.blue,
  dashed = false,
}: {
  from: Pt;
  to: Pt;
  bend?: number;
  drawAt?: number;
  drawFor?: number;
  packets?: { at: number; label?: string; reverse?: boolean; color?: string }[];
  travel?: number;
  color?: string;
  dashed?: boolean;
}) {
  const frame = useCurrentFrame();
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // control point pushed sideways from the midpoint by `bend` of the length
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const cx = mx - dy * bend;
  const cy = my + dx * bend;
  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  const progress = interpolate(frame, [drawAt, drawAt + drawFor], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const evolved = evolvePath(progress, d);
  const at = (t: number) => {
    const u = 1 - t;
    return { x: u * u * from.x + 2 * u * t * cx + t * t * to.x, y: u * u * from.y + 2 * u * t * cy + t * t * to.y };
  };

  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeOpacity={0.35}
        strokeWidth={5}
        strokeLinecap="round"
        strokeDasharray={dashed ? "2 14" : evolved.strokeDasharray}
        strokeDashoffset={dashed ? -frame * 1.5 : evolved.strokeDashoffset}
        opacity={dashed ? progress : 1}
      />
      {packets.map((p, i) => {
        const raw = (frame - p.at) / travel;
        if (raw < 0 || raw > 1.15) return null;
        const t = Math.min(1, raw);
        const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const pos = at(p.reverse ? 1 - eased : eased);
        const fade = raw > 1 ? 1 - (raw - 1) / 0.15 : 1;
        const c = p.color ?? color;
        return (
          <g key={i} opacity={fade}>
            <circle cx={pos.x} cy={pos.y} r={22} fill={c} opacity={0.18} />
            <circle cx={pos.x} cy={pos.y} r={11} fill={c} />
            {p.label ? (
              <g>
                <rect x={pos.x + 18} y={pos.y - 44} rx={14} width={p.label.length * 15 + 28} height={38} fill={colors.ink} />
                <text x={pos.x + 32} y={pos.y - 18} fill="#fff" fontSize={22} fontFamily={fonts.mono} fontWeight={700}>
                  {p.label}
                </text>
              </g>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
