import { Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { brand, colors, fonts } from "./brand";

// End card: the InternHack profile, a finger tap on Follow at `tapAt`, the button flips to Following.

export function FollowCard({
  tapAt = 36,
  line = "Roz ek real-life system design, Hinglish mein.",
  top = 760,
}: {
  tapAt?: number;
  line?: string;
  top?: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  const press = spring({ frame: frame - tapAt, fps, config: { damping: 12, stiffness: 300 } });
  const pressScale = 1 - 0.08 * Math.sin(Math.min(1, Math.max(0, (frame - tapAt) / 6)) * Math.PI);
  const followed = frame >= tapAt + 3;
  const finger = interpolate(frame, [tapAt - 18, tapAt], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top,
        width: 860,
        padding: 44,
        borderRadius: 40,
        background: colors.surface,
        border: `2px solid ${colors.border}`,
        boxShadow: "0 40px 80px -30px rgba(12,10,9,0.28)",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [80, 0])}px) scale(${interpolate(enter, [0, 1], [0.94, 1])})`,
      }}
    >
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        <Img src={brand.logo()} style={{ width: 132, height: 132, borderRadius: 34 }} />
        <div>
          <div style={{ fontFamily: fonts.display, fontSize: 52, fontWeight: 700 }}>{brand.name}</div>
          <div style={{ fontSize: 34, color: colors.muted, marginTop: 4 }}>{brand.handle}</div>
        </div>
      </div>
      <div style={{ fontSize: 34, lineHeight: 1.35, marginTop: 30 }}>
        {brand.tagline}
        <br />
        <span style={{ color: colors.muted }}>{line}</span>
      </div>
      <div style={{ display: "flex", gap: 18, marginTop: 36 }}>
        <div
          style={{
            flex: 1,
            height: 92,
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
            background: followed ? colors.surfaceAlt : colors.blue,
            color: followed ? colors.ink : "#fff",
            border: followed ? `2px solid ${colors.border}` : "2px solid transparent",
            transform: `scale(${pressScale})`,
          }}
        >
          {followed ? "Following ✓" : "Follow"}
        </div>
        <div
          style={{
            flex: 1,
            height: 92,
            borderRadius: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 600,
            background: colors.surfaceAlt,
            border: `2px solid ${colors.border}`,
          }}
        >
          Message
        </div>
      </div>
      <TapDot x={44 + 190} y={44 + 132 + 30 + 92 + 36 + 46} visible={frame < tapAt + 14} lift={finger} press={press} />
    </div>
  );
}

// A touch indicator: a soft disc that settles onto the target and ripples on contact.
export function TapDot({ x, y, visible, lift, press }: { x: number; y: number; visible: boolean; lift: number; press: number }) {
  if (!visible) return null;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 34 + lift * 160,
          width: 68,
          height: 68,
          borderRadius: 999,
          background: "rgba(12,10,9,0.18)",
          border: "3px solid rgba(255,255,255,0.9)",
          opacity: 1 - lift * 0.6,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: x - 34,
          top: y - 34,
          width: 68,
          height: 68,
          borderRadius: 999,
          border: `4px solid ${colors.blue}`,
          opacity: press > 0 ? 1 - press : 0,
          transform: `scale(${1 + press * 1.6})`,
        }}
      />
    </>
  );
}
