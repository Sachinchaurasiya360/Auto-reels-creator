import type { ReactNode } from "react";
import { interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";

// Reusable drawn props for series reels. No images: everything is drawn, so it stays sharp at any
// scale and recolours with the brand.

// A QR code that reads as real: three finder squares, timing pattern, seeded data modules.
export function QRCode({ size = 300, seed = "upi", color = colors.ink, reveal = 1 }: { size?: number; seed?: string; color?: string; reveal?: number }) {
  const n = 29;
  const cell = size / n;
  const finder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  const cells: ReactNode[] = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (finder(r, c)) continue;
      const timing = (r === 6 || c === 6) && (r + c) % 2 === 0;
      const on = timing || random(`${seed}-${r}-${c}`) > 0.52;
      // modules appear in a diagonal sweep as `reveal` goes 0 -> 1
      if (on && (r + c) / (2 * n) <= reveal) {
        cells.push(<rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell + 0.4} height={cell + 0.4} fill={color} />);
      }
    }
  }
  const finderAt = (x: number, y: number) => (
    <g key={`f${x}${y}`} opacity={Math.min(1, reveal * 3)}>
      <rect x={x * cell} y={y * cell} width={7 * cell} height={7 * cell} rx={cell * 1.2} fill={color} />
      <rect x={(x + 1) * cell} y={(y + 1) * cell} width={5 * cell} height={5 * cell} rx={cell * 0.8} fill="#fff" />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={3 * cell} height={3 * cell} rx={cell * 0.6} fill={color} />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells}
      {finderAt(0, 0)}
      {finderAt(n - 7, 0)}
      {finderAt(0, n - 7)}
    </svg>
  );
}

// The merchant soundbox: dark speaker cube with grille, status LED, display strip and a SIM slot.
// `speaking` 0..1 drives the sound rings; `sim` 0..1 slides a SIM card into the slot.
export function Soundbox({ x, y, size = 300, speaking = 0, sim = 0, label = "₹10", ledOn = true }: { x: number; y: number; size?: number; speaking?: number; sim?: number; label?: string; ledOn?: boolean }) {
  const frame = useCurrentFrame();
  const s = size / 300;
  const rings = [0, 1, 2];
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 300, height: 340, transform: `scale(${s})`, transformOrigin: "0 0" }}>
      {speaking > 0
        ? rings.map((r) => {
            const p = ((frame / 18 + r / 3) % 1) * speaking;
            return (
              <div
                key={r}
                style={{
                  position: "absolute",
                  left: 150 - 120 - p * 140,
                  top: 140 - 120 - p * 140,
                  width: 240 + p * 280,
                  height: 240 + p * 280,
                  borderRadius: 999,
                  border: `4px solid ${colors.blue}`,
                  opacity: (1 - p) * 0.6 * speaking,
                }}
              />
            );
          })
        : null}
      <div style={{ position: "absolute", left: 40, right: 40, bottom: 0, height: 40, borderRadius: "50%", background: "rgba(12,10,9,0.25)", filter: "blur(18px)" }} />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 10,
          width: 260,
          height: 300,
          borderRadius: 46,
          background: "linear-gradient(160deg, #2a2d34 0%, #121418 70%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,0.12), 0 30px 50px -24px rgba(12,10,9,0.5)",
        }}
      >
        {/* grille */}
        <div style={{ position: "absolute", left: 40, top: 36, width: 180, height: 130, display: "grid", gridTemplateColumns: "repeat(9, 1fr)", gap: 8 }}>
          {Array.from({ length: 54 }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: 99, background: "#05060a", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.08)" }} />
          ))}
        </div>
        {/* display strip */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 190,
            width: 180,
            height: 54,
            borderRadius: 12,
            background: "#0b1d12",
            color: "#7CFF9B",
            fontFamily: fonts.mono,
            fontWeight: 700,
            fontSize: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            letterSpacing: 1,
            textShadow: speaking > 0 ? "0 0 10px rgba(124,255,155,0.7)" : "none",
          }}
        >
          {speaking > 0 ? label : "----"}
        </div>
        {/* LED */}
        <div style={{ position: "absolute", right: 30, top: 262, width: 14, height: 14, borderRadius: 99, background: ledOn ? "#22c55e" : "#3f3f46", boxShadow: ledOn ? "0 0 12px #22c55e" : "none" }} />
        {/* SIM slot */}
        <div style={{ position: "absolute", left: -6, top: 240, width: 12, height: 44, borderRadius: 4, background: "#050505" }} />
      </div>
      {/* SIM card sliding in from the left */}
      {sim > 0 ? (
        <div
          style={{
            position: "absolute",
            left: interpolate(sim, [0, 1], [-170, -78]),
            top: 244,
            width: 100,
            height: 66,
            borderRadius: "10px 10px 10px 22px",
            background: "linear-gradient(135deg, #f5d36b, #d6a72c)",
            border: "2px solid #b88a1c",
            opacity: Math.min(1, sim * 2),
          }}
        >
          <div style={{ position: "absolute", left: 30, top: 14, width: 40, height: 34, borderRadius: 6, background: "#e9c45a", border: "2px solid #a87b12" }} />
        </div>
      ) : null}
    </div>
  );
}

// A number that rolls up to `value` between reel frames, tabular so it doesn't jitter.
export function Counter({ value, decimals = 0, progress, prefix = "", suffix = "", size = 160, color = colors.ink }: { value: number; decimals?: number; progress: number; prefix?: string; suffix?: string; size?: number; color?: string }) {
  const v = value * progress;
  return (
    <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: size, color, fontVariantNumeric: "tabular-nums", letterSpacing: -2 }}>
      {prefix}
      {v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

// A label chip that gets struck through (a party that is NOT involved).
export function StrikeChip({ label, strike, x, y, dark = false }: { label: string; strike: number; x: number; y: number; dark?: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "16px 30px",
        borderRadius: 999,
        background: dark ? "#1b1e24" : colors.surface,
        border: `2px solid ${strike > 0.5 ? colors.red : dark ? "#30343d" : colors.border}`,
        fontFamily: fonts.display,
        fontWeight: 700,
        fontSize: 40,
        color: dark ? "#fff" : colors.ink,
        boxShadow: "0 20px 40px -24px rgba(12,10,9,0.35)",
      }}
    >
      <span style={{ opacity: 1 - strike * 0.45 }}>{label}</span>
      <div
        style={{
          position: "absolute",
          left: 18,
          top: "50%",
          height: 6,
          borderRadius: 6,
          width: `calc(${strike * 100}% - 36px)`,
          background: colors.red,
          transform: "rotate(-6deg)",
        }}
      />
    </div>
  );
}

// A small card with a title and rows; used for rules, receipts, ledgers.
export function InfoCard({ x, y, w = 760, title, eyebrow, children, enter = 1 }: { x: number; y: number; w?: number; title: ReactNode; eyebrow?: string; children?: ReactNode; enter?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        padding: "34px 40px",
        borderRadius: 34,
        background: colors.surface,
        border: `2px solid ${colors.border}`,
        boxShadow: "0 40px 80px -36px rgba(12,10,9,0.32)",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 50}px) scale(${0.94 + 0.06 * enter})`,
      }}
    >
      {eyebrow ? <div style={{ fontSize: 26, fontWeight: 600, color: colors.muted, marginBottom: 10 }}>{eyebrow}</div> : null}
      <div style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 700, lineHeight: 1.1 }}>{title}</div>
      {children}
    </div>
  );
}

// A plain bank glyph (pediment, columns, base): an accent, not a hero.
export function BankGlyph({ size = 56, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke={color} strokeWidth={3.2} strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 18 L24 7 L42 18 Z" />
      <path d="M11 22 V36 M19 22 V36 M29 22 V36 M37 22 V36" />
      <path d="M6 41 H42" />
    </svg>
  );
}

export function usePopAt(frameAt: number) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - frameAt, fps, config: { damping: 13, stiffness: 170 } });
}
