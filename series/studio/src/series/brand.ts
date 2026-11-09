// InternHack series brand. Values come from the product itself
// (../InternHack/client/src/index.css and the logo), so the reels and the site read as one thing.

import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { loadFont as loadInstrumentSerif } from "@remotion/google-fonts/InstrumentSerif";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadJetBrainsMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { staticFile } from "remotion";
import type { RemocnTheme } from "@/lib/remocn-ui";
import type { SnapCnTheme } from "@/lib/snap-cn-ui/theme";

export const fonts = {
  display: loadSpaceGrotesk("normal", { weights: ["500", "600", "700"], subsets: ["latin"] }).fontFamily,
  body: loadInter("normal", { weights: ["400", "500", "600", "700", "800"], subsets: ["latin"] }).fontFamily,
  mono: loadJetBrainsMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
  // editorial titles for news reels (Press.tsx); italic is loaded too
  // marker handwriting for the whiteboard (Whiteboard.tsx)
  hand: loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin"] }).fontFamily,
  serif: (loadInstrumentSerif("italic", { subsets: ["latin"] }), loadInstrumentSerif("normal", { subsets: ["latin"] }).fontFamily),
};

export const colors = {
  ground: "#fafaf9", // page centre
  groundEdge: "#efedea", // page edges, the gradient deepens toward them
  surface: "#ffffff",
  surfaceAlt: "#f5f5f4",
  ink: "#0c0a09",
  muted: "#57534e",
  faint: "#a8a29e",
  border: "#e7e5e4",
  blue: "#0074ff", // the H in the logo: the one accent
  blueSoft: "#e6f1ff",
  lime: "#a3e635", // site accent: success / "it worked" only
  limeInk: "#3f6212",
  red: "#ef4444", // failure, overload, rejected
  amber: "#f59e0b", // waiting, slow
  code: "#0f1115", // editor and terminal surfaces
};

export const brand = {
  name: "InternHack",
  handle: "@intern.hack",
  site: "internhack.xyz",
  tagline: "Prepare. Practice. Placed.",
  logo: () => staticFile("brand/internhack-logo.png"),
};

// 1080x1920 safe area: platform UI covers the top 220px, the bottom 590px and the right rail.
export const safe = { top: 220, bottom: 1330, left: 70, right: 940 };

const shadcnTokens = {
  background: colors.ground,
  foreground: colors.ink,
  card: colors.surface,
  cardForeground: colors.ink,
  popover: colors.surface,
  popoverForeground: colors.ink,
  primary: colors.blue,
  primaryForeground: "#ffffff",
  secondary: colors.surfaceAlt,
  secondaryForeground: colors.ink,
  muted: colors.surfaceAlt,
  mutedForeground: colors.muted,
  accent: colors.blueSoft,
  accentForeground: colors.ink,
  destructive: colors.red,
  destructiveForeground: "#ffffff",
  border: colors.border,
  input: colors.border,
  ring: colors.blue,
  radius: 18,
};

export const remocnTheme: RemocnTheme = shadcnTokens;
export const snapTheme: SnapCnTheme = { ...shadcnTokens, fontFamily: fonts.body };

export type SeriesKind = "system-design" | "mock-interview" | "tech-news" | "github-pick" | "ai-tool" | "myth" | "andar-kya-hai" | "claude-se-reels";

export const seriesLabel: Record<SeriesKind, string> = {
  "system-design": "Real Life System Design",
  "mock-interview": "Mock Interview",
  "tech-news": "Tech News, Explained",
  "github-pick": "GitHub Pick",
  "ai-tool": "Tool of the Day",
  myth: "Galat Samajh Rahe Ho",
  "andar-kya-hai": "What's Inside?",
  "claude-se-reels": "Claude se Reels",
};
