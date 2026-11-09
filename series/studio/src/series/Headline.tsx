import { colors, fonts } from "./brand";
import { ramp } from "./Reel";

// Chapter headline: one big 2-4 word line per scene, so a sound-off scroller gets the whole story from headlines
// alone (LESSONS 2026-11-09, net-merge vs HowHub: their "2 HOURS WASTED / DUAL NETWORK MERGE / 2X TO 3X FASTER"
// headlines beat our small captions). Sits under the captions (which build at y 340) and above the scene.
// `accent` is the word(s) drawn in the accent colour; `tag` is an optional small chip above the line.
export function Headline({
  t,
  at,
  until,
  text,
  accent,
  accentColor = colors.blue,
  tag,
  tagColor = colors.ink,
  y = 570,
  size = 92,
  align = "center",
}: {
  t: number;
  at: number;
  until?: number;
  text: string;
  accent?: string;
  accentColor?: string;
  tag?: string;
  tagColor?: string;
  y?: number;
  size?: number;
  align?: "center" | "left";
}) {
  const inn = at <= 0 ? 1 : ramp(t, at, at + 0.28); // a hook headline is already there on frame 0
  const out = until === undefined ? 0 : ramp(t, until - 0.18, until);
  if (t < at || (until !== undefined && t > until)) return null;
  const parts = accent && text.includes(accent) ? text.split(accent) : [text];
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: y,
        textAlign: align,
        opacity: inn * (1 - out),
        transform: `translateY(${(1 - inn) * 24}px) scale(${0.96 + 0.04 * inn})`,
        transformOrigin: align === "center" ? "50% 0" : "0 0",
      }}
    >
      {tag ? (
        <div style={{ display: "inline-block", marginBottom: 14, padding: "8px 20px", borderRadius: 999, background: tagColor, color: "#fff", fontFamily: fonts.display, fontWeight: 700, fontSize: 30, letterSpacing: 2, textTransform: "uppercase" }}>
          {tag}
        </div>
      ) : null}
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: -1.5, textTransform: "uppercase", color: colors.ink }}>
        {parts.length === 2 ? (
          <>
            {parts[0]}
            <span style={{ color: accentColor }}>{accent}</span>
            {parts[1]}
          </>
        ) : (
          text
        )}
      </div>
    </div>
  );
}
