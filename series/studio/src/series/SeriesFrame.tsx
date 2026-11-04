import type { ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { RemocnUIProvider } from "@/lib/remocn-ui";
import { SnapCnUIProvider } from "@/lib/snap-cn-ui/theme";
import { brand, colors, fonts, remocnTheme, safe, seriesLabel, snapTheme, type SeriesKind } from "./brand";

// The ground every series reel sits on: warm off-white with a soft centre light, a faint dot grid
// that drifts slowly (so a held beat never looks frozen), and the series badge at the top of the safe area.

export function SeriesFrame({
  series,
  episode,
  children,
  showHandle = true,
}: {
  series: SeriesKind;
  episode: number;
  children?: ReactNode;
  showHandle?: boolean;
}) {
  const frame = useCurrentFrame();
  const drift = (frame * 0.25) % 40;

  return (
    <RemocnUIProvider theme={remocnTheme} mode="light">
      <SnapCnUIProvider theme={snapTheme} mode="light">
        <AbsoluteFill
          style={{
            background: `radial-gradient(120% 75% at 50% 38%, ${colors.ground} 0%, ${colors.ground} 45%, ${colors.groundEdge} 100%)`,
            fontFamily: fonts.body,
            color: colors.ink,
          }}
        >
          <AbsoluteFill
            style={{
              backgroundImage: `radial-gradient(${colors.faint} 1.6px, transparent 1.7px)`,
              backgroundSize: "40px 40px",
              backgroundPosition: `${drift}px ${drift}px`,
              opacity: 0.22,
              maskImage: "radial-gradient(90% 70% at 50% 45%, transparent 20%, black 100%)",
            }}
          />
          <AbsoluteFill>{children}</AbsoluteFill>
          <SeriesBadge series={series} episode={episode} />
          {showHandle ? (
            <div
              style={{
                position: "absolute",
                top: safe.bottom - 52,
                width: "100%",
                textAlign: "center",
                fontSize: 28,
                fontWeight: 500,
                color: colors.faint,
                letterSpacing: 0.2,
              }}
            >
              {brand.handle}
            </div>
          ) : null}
        </AbsoluteFill>
      </SnapCnUIProvider>
    </RemocnUIProvider>
  );
}

export function SeriesBadge({ series, episode }: { series: SeriesKind; episode: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 18, stiffness: 140 } });

  return (
    <div
      style={{
        position: "absolute",
        top: safe.top + 24,
        left: 0,
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 14,
        alignItems: "center",
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [-16, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "8px 22px 8px 8px",
          borderRadius: 999,
          background: colors.ink,
          color: "#fff",
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        <Img src={brand.logo()} style={{ width: 44, height: 44, borderRadius: 12 }} />
        {seriesLabel[series]}
      </div>
      <div
        style={{
          padding: "14px 22px",
          borderRadius: 999,
          background: colors.surface,
          border: `2px solid ${colors.border}`,
          fontSize: 28,
          fontWeight: 600,
          fontFamily: fonts.display,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        Part {episode}
      </div>
    </div>
  );
}
