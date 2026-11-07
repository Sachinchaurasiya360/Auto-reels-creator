import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";

// The reel's one comment driver, drawn as an Instagram-style comment sheet:
// the question, two or three answer chips, and the reply box typing the viewer's answer.

export function CommentPrompt({
  question,
  options,
  typed,
  top = 620,
}: {
  question: string;
  options: [string, string] | [string, string, string] | [string, string, string, string]; // 4 = short one-word answers (operators, brands)
  typed?: string;
  top?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, stiffness: 130 } });
  const chip = (i: number) => spring({ frame: frame - 10 - i * 6, fps, config: { damping: 12, stiffness: 180 } });
  const text = typed ?? options[0];
  const chars = Math.floor(interpolate(frame, [30, 30 + text.length * 2], [0, text.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const caretOn = Math.floor(frame / 15) % 2 === 0;

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        top,
        width: 900,
        padding: "40px 44px",
        borderRadius: 40,
        background: colors.surface,
        border: `2px solid ${colors.border}`,
        boxShadow: "0 40px 80px -30px rgba(12,10,9,0.25)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [70, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 30, fontWeight: 600, color: colors.muted }}>Comment karo</div>
      <div style={{ fontFamily: fonts.display, fontSize: 60, fontWeight: 700, lineHeight: 1.12, marginTop: 18 }}>{question}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 18, marginTop: 30 }}>
        {options.map((o, i) => (
          <div
            key={o}
            style={{
              padding: "18px 30px",
              borderRadius: 999,
              fontSize: 36,
              fontWeight: 700,
              background: i === 0 ? colors.blueSoft : colors.surfaceAlt,
              color: i === 0 ? colors.blue : colors.ink,
              border: `2px solid ${i === 0 ? colors.blue : colors.border}`,
              opacity: chip(i),
              transform: `scale(${interpolate(chip(i), [0, 1], [0.7, 1])})`,
            }}
          >
            {o}
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: 34,
          height: 92,
          borderRadius: 999,
          border: `2px solid ${colors.border}`,
          background: colors.surfaceAlt,
          display: "flex",
          alignItems: "center",
          padding: "0 34px",
          fontSize: 34,
          color: chars ? colors.ink : colors.faint,
        }}
      >
        {chars ? text.slice(0, chars) : "Add a comment…"}
        {chars ? <span style={{ opacity: caretOn ? 1 : 0, color: colors.blue, marginLeft: 2 }}>|</span> : null}
      </div>
    </div>
  );
}
