import { colors, fonts } from "./brand";
import { Counter } from "./Props";

// GitHub repo card: owner / name, one-line description, chips (licence, maker...), a star counter that counts up,
// and an optional green badge. Moved out of reels/ToolOfTheDay.tsx (2026-11-05) so every tool/GitHub reel shares it.

export const GithubMark = ({ size = 54, color = colors.ink }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.290 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.070-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

export function RepoCard({
  x = 100,
  y = 660,
  w = 880,
  owner,
  name,
  desc,
  chips = [],
  chipShow = [],
  stars,
  starsProgress,
  starsDecimals = 0,
  starsSuffix = "",
  badge,
  badgeScale = 1,
  enter = 1,
}: {
  x?: number;
  y?: number;
  w?: number;
  owner: string;
  name: string;
  desc: string;
  chips?: string[];
  chipShow?: number[]; // per-chip opacity 0-1 (defaults to 1)
  stars: number;
  starsProgress: number;
  starsDecimals?: number;
  starsSuffix?: string;
  badge?: string;
  badgeScale?: number;
  enter?: number;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: 40, borderRadius: 34, background: colors.surface, border: `2px solid ${colors.border}`, boxShadow: "0 40px 80px -36px rgba(12,10,9,0.3)", opacity: enter, transform: `translateY(${(1 - enter) * 50}px)`, fontFamily: fonts.body }}>
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <GithubMark />
        <div style={{ fontSize: 40 }}>
          <span style={{ color: colors.muted }}>{owner} / </span>
          <span style={{ fontFamily: fonts.display, fontWeight: 700 }}>{name}</span>
        </div>
      </div>
      <div style={{ marginTop: 18, fontSize: 30, color: colors.muted, lineHeight: 1.35 }}>{desc}</div>
      {chips.length ? (
        <div style={{ marginTop: 26, display: "flex", gap: 16, flexWrap: "wrap", fontSize: 28, fontWeight: 600 }}>
          {chips.map((c, i) => (
            <span key={c} style={{ padding: "10px 18px", borderRadius: 999, background: colors.surfaceAlt, opacity: chipShow[i] ?? 1 }}>
              {c}
            </span>
          ))}
        </div>
      ) : null}
      <div style={{ marginTop: 34, display: "flex", alignItems: "center", gap: 24 }}>
        <span style={{ fontSize: 64, color: "#e3b341" }}>★</span>
        <Counter value={stars} progress={starsProgress} decimals={starsDecimals} suffix={starsSuffix} size={110} />
        {badge ? (
          <span style={{ marginLeft: "auto", padding: "12px 22px", borderRadius: 16, background: "#dcfce7", color: "#166534", fontSize: 30, fontWeight: 700, transform: `scale(${badgeScale})` }}>{badge}</span>
        ) : null}
      </div>
    </div>
  );
}
