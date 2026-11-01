import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { CodeMorph, getCodeMorphLayout } from "@/components/remocn/code-morph";
import { ImessageChatFlow, imessageChatFlowDuration, type ImessageMessage } from "@/components/remocn/imessage-chat-flow";
import { ImpactShake } from "@/components/remocn/impact-shake";
import { InkArrow } from "@/components/remocn/ink-arrow";
import { NumberWheel, Odometer } from "@/components/remocn/number-wheel";
import { SplitScreen } from "@/components/onda/split-screen/SplitScreen";
import { splitScreenSchema } from "@/components/onda/split-screen/schema";
import { Underline, underlineSchema } from "@/components/onda/underline/Underline";
import { colors, fonts } from "./brand";
import { FPS } from "./Reel";
import { Stage } from "./Stage";

// Third-party pieces (Remocn / onda) that passed the vertical trial of 2026-11-02 (out/sf/lib-sheet-*.png),
// wrapped in our brand and placed in the content band. Reach for these before drawing a new scene.
// Timing: each wrapper starts at `at` seconds into its Beat (default 0) and runs for `dur` seconds.

// Brand the libraries through their CSS variables: onda reads --onda-*, remocn reads --font-geist-*.
export const brandVars = {
  "--onda-accent": colors.blue,
  "--onda-bg": colors.ground,
  "--onda-surface": colors.surface,
  "--onda-surface-2": colors.surfaceAlt,
  "--onda-border": colors.border,
  "--onda-border-lit": "#d6d3d1",
  "--onda-text": colors.ink,
  "--onda-dim": colors.muted,
  "--onda-faint": colors.faint,
  "--onda-font-display": fonts.display,
  "--onda-font-body": fonts.body,
  "--font-geist-sans": fonts.body,
  "--font-geist-mono": fonts.mono,
} as CSSProperties;

// The content band: x 90-990, y 560-1320.
export const BAND = { x: 90, y: 560, w: 900, h: 760 };

// A canvas the size of the band, so components that lay out from useVideoConfig() fill the band.
export const Band = ({ children, h = BAND.h, y = BAND.y }: { children: ReactNode; h?: number; y?: number }) => (
  <Stage design={{ w: BAND.w, h }} x={BAND.x} y={y} width={BAND.w} clip={false}>
    <AbsoluteFill style={brandVars}>{children}</AbsoluteFill>
  </Stage>
);

const At = ({ at = 0, dur, children }: { at?: number; dur?: number; children: ReactNode }) => (
  <Sequence from={Math.round(at * FPS)} durationInFrames={dur ? Math.round(dur * FPS) : undefined} layout="none">
    {children}
  </Sequence>
);

// Code shown where it lives: light IDE panel, line numbers, tokens morph from one version to the next.
// steps: [{ at: frames-from-start, code }]. The crop is computed from the panel, so text size follows the
// longest line: keep lines under ~34 characters for >= 32px text, and 2-5 lines.
export function CodeBeat({ filename, steps, y = 760, at }: { filename: string; steps: { at: number; code: string }[]; y?: number; at?: number }) {
  const L = getCodeMorphLayout({ filename, steps, fontSize: 28 });
  const pw = L.padLeft + L.padRight + (L.gutter + L.columns) * 0.6 * L.fontSize; // ADVANCE = 0.6 in code-morph
  const ph = L.header + L.padTop + L.padBottom + L.rows * L.lineHeight;
  const m = 12;
  const focus = { x: (1280 - pw) / 2 - m, y: (720 - ph) / 2 - m, w: pw + 2 * m, h: ph + 2 * m };
  return (
    <At at={at}>
      <Stage design={{ w: 1280, h: 720 }} focus={focus} x={BAND.x} y={y} width={BAND.w} clip={false}>
        <AbsoluteFill style={brandVars}>
          <CodeMorph theme="light" filename={filename} accentColor={colors.blue} fontSize={28} steps={steps} />
        </AbsoluteFill>
      </Stage>
    </At>
  );
}

// Interview as an iMessage thread: "them" = Arjun (interviewer), "me" = Priya (candidate).
// Bubbles arrive on their own clock; `interviewChatSeconds(messages)` tells you how long the Beat needs.
export function InterviewChat({ messages, y = 540, at }: { messages: ImessageMessage[]; y?: number; at?: number }) {
  return (
    <At at={at}>
      <Stage design={{ w: 460, h: 400 }} x={BAND.x} y={y} width={BAND.w} clip>
        <AbsoluteFill style={brandVars}>
          <ImessageChatFlow contact={{ name: "Arjun" }} accentColor={colors.blue} messages={messages} />
        </AbsoluteFill>
      </Stage>
    </At>
  );
}
export const interviewChatSeconds = (messages: ImessageMessage[]) => imessageChatFlowDuration(messages) / FPS;
export type { ImessageMessage };

// Big rolling counter (odometer), e.g. 17,000 -> 1,300. Rolls across `dur` seconds, then holds `to`.
export function BigNumber({ from, to, dur = 3, at, y = 790, fontSize = 180, color = colors.ink }: { from: number; to: number; dur?: number; at?: number; y?: number; fontSize?: number; color?: string }) {
  return (
    <At at={at}>
      <Band h={300} y={y}>
        <RollThenHold from={from} to={to} dur={dur} fontSize={fontSize} color={color} />
      </Band>
    </At>
  );
}

function RollThenHold({ from, to, dur, fontSize, color }: { from: number; to: number; dur: number; fontSize: number; color: string }) {
  const frame = useCurrentFrame();
  const frames = Math.round(dur * FPS);
  if (frame >= frames) return <Odometer current={to} fontSize={fontSize} color={color} />;
  return (
    <Sequence durationInFrames={frames} layout="none">
      <NumberWheel from={from} to={to} fontSize={fontSize} color={color} />
    </Sequence>
  );
}

// Hand-drawn arrow between two frame points (px in the 1080x1920 frame). Draws in over ~1.2 s.
export function Annotate({ from, to, at, color = colors.blue, curvature = 0.4 }: { from: { x: number; y: number }; to: { x: number; y: number }; at?: number; color?: string; curvature?: number }) {
  return (
    <At at={at}>
      <div style={{ position: "absolute", left: 0, top: 0 }}>
        <InkArrow from={from} to={to} color={color} strokeWidth={12} headSize={36} curvature={curvature} />
      </div>
    </At>
  );
}

// A verdict word slams in with squash and dust: DECLINED, 429, FAILED, DROP.
export function Verdict({ text, at, color = colors.red, y }: { text: string; at?: number; color?: string; y?: number }) {
  return (
    <At at={at}>
      <Band y={y}>
        <ImpactShake text={text} backgroundColor="transparent" foregroundColor={color} intensity={1} />
      </Band>
    </At>
  );
}

// Before / after stacked in two white panes. Content is ours.
export function BeforeAfter({ before, after, at }: { before: ReactNode; after: ReactNode; at?: number }) {
  return (
    <At at={at}>
      <Band>
        <SplitScreen {...splitScreenSchema.parse({ orientation: "vertical", width: BAND.w, height: BAND.h, gap: 16 })} left={before} right={after} />
      </Band>
    </At>
  );
}

// One phrase with a drawn blue underline, for the word the viewer must remember.
export function Emphasis({ text, at, y = 790, fontSize = 120 }: { text: string; at?: number; y?: number; fontSize?: number }) {
  return (
    <At at={at}>
      <Band h={300} y={y}>
        <Underline {...underlineSchema.parse({ text, fontSize, lineThickness: 10, lineOffset: 12, accentColor: colors.blue, fontFamily: fonts.display })} />
      </Band>
    </At>
  );
}
