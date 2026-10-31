"use client";

import { AbsoluteFill, OffthreadVideo, useVideoConfig } from "remotion";

export function CheckoutPush(_props: Record<string, unknown>) {
  const { height } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <OffthreadVideo
        src="https://pub-fa46097ee10347be9148f726175a1c28.r2.dev/pro-demos/checkout-push.mp4?v=fdcb5bcf38"
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          right: height * 0.03,
          bottom: height * 0.03,
          padding: `${height * 0.012}px ${height * 0.02}px`,
          borderRadius: 999,
          background: "rgba(10,10,12,0.55)",
          color: "rgba(255,255,255,0.92)",
          fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: height * 0.028,
          fontWeight: 500,
        }}
      >
        snapcn Pro preview · get it at snapcn.dev/docs/pricing
      </div>
    </AbsoluteFill>
  );
}
