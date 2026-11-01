import type { ReactNode } from "react";

// Layout helpers every reel uses.

// Fades everything below the platform-UI line, so a tall phone can bleed off the safe area.
export const Bleed = ({ children }: { children: ReactNode }) => (
  <div style={{ position: "absolute", inset: 0, maskImage: "linear-gradient(180deg, black 0%, black 1250px, transparent 1400px)" }}>{children}</div>
);

// Absolutely placed element that scales in with `s` (pass usePop(...)), optionally tilted.
export const Pop = ({ s, x, y, rotate = 0, children }: { s: number; x: number; y: number; rotate?: number; children: ReactNode }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${rotate}deg)`, transformOrigin: "center" }}>{children}</div>
);
