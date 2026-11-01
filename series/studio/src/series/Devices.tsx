import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// Drawn devices beyond the phone: a laptop (screen as children), a home/college Wi-Fi router,
// a cell tower, and the incognito glyph.

export function Laptop({ x, y, width = 900, children }: { x: number; y: number; width?: number; children?: ReactNode }) {
  const lidH = width * 0.62;
  return (
    <div style={{ position: "absolute", left: x, top: y, width }}>
      <div style={{ width, height: lidH, borderRadius: 28, background: "#27272a", padding: width * 0.025, boxShadow: "0 50px 90px -40px rgba(12,10,9,0.5)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 12, overflow: "hidden", background: "#fff" }}>{children}</div>
      </div>
      <div
        style={{
          width: width * 1.12,
          marginLeft: -width * 0.06,
          height: width * 0.04,
          background: "linear-gradient(180deg,#d4d4d8,#a1a1aa)",
          borderRadius: `6px 6px ${width * 0.03}px ${width * 0.03}px`,
        }}
      />
    </div>
  );
}

export function Router({ x, y, width = 300, label, lit = 1 }: { x: number; y: number; width?: number; label?: string; lit?: number }) {
  const s = width / 300;
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height: 260 * s }}>
      <svg width={width} height={200 * s} viewBox="0 0 300 200">
        <rect x={40} y={0} width={14} height={110} rx={7} fill="#3f3f46" transform="rotate(-12 47 110)" />
        <rect x={246} y={0} width={14} height={110} rx={7} fill="#3f3f46" transform="rotate(12 253 110)" />
        <rect x={10} y={100} width={280} height={90} rx={22} fill="#fafaf9" stroke="#a8a29e" strokeWidth={4} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={60 + i * 40} cy={146} r={9} fill={i < 3 && lit > 0.5 ? colors.lime : "#d6d3d1"} />
        ))}
      </svg>
      {label ? (
        <div style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 36 * Math.max(1, s * 0.9), color: colors.ink, marginTop: 6 }}>{label}</div>
      ) : null}
    </div>
  );
}

export function CellTower({ x, y, height = 420, label, waves = 1 }: { x: number; y: number; height?: number; label?: string; waves?: number }) {
  const s = height / 420;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300 * s, height: height + 60 }}>
      <svg width={300 * s} height={height} viewBox="0 0 300 420">
        {[0, 1, 2].map((i) =>
          waves > 0 ? (
            <g key={i} opacity={waves * (1 - i * 0.3)} fill="none" stroke={colors.blue} strokeWidth={8} strokeLinecap="round">
              <path d={`M${110 - i * 26} ${40 - i * 4} Q${90 - i * 30} ${70} ${110 - i * 26} ${100 + i * 4}`} />
              <path d={`M${190 + i * 26} ${40 - i * 4} Q${210 + i * 30} ${70} ${190 + i * 26} ${100 + i * 4}`} />
            </g>
          ) : null,
        )}
        <path d="M150 60 L80 420 M150 60 L220 420 M108 280 L192 280 M96 340 L204 340 M120 200 L180 200 M130 140 L170 140 M108 280 L180 200 M192 280 L120 200 M96 340 L192 280 M204 340 L108 280" stroke="#57534e" strokeWidth={9} fill="none" strokeLinecap="round" />
        <rect x={128} y={36} width={44} height={64} rx={8} fill={colors.ink} />
        <circle cx={150} cy={30} r={10} fill={colors.red} />
      </svg>
      {label ? <div style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 38, color: colors.ink }}>{label}</div> : null}
    </div>
  );
}

// Hat + glasses, the private-browsing glyph.
export function IncognitoGlyph({ size = 160, color = "#e7e5e4" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 200 160">
      <path d="M40 70 L62 14 Q66 6 76 10 L100 20 L124 10 Q134 6 138 14 L160 70 Z" fill={color} />
      <rect x={14} y={70} width={172} height={14} rx={7} fill={color} />
      <circle cx={62} cy={122} r={26} fill="none" stroke={color} strokeWidth={10} />
      <circle cx={138} cy={122} r={26} fill="none" stroke={color} strokeWidth={10} />
      <path d="M88 118 Q100 108 112 118" fill="none" stroke={color} strokeWidth={10} />
    </svg>
  );
}
