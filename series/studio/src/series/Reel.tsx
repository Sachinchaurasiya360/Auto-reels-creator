import type { ReactNode } from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { SeriesKind } from "./brand";
import { Captions, type CaptionWord } from "./Captions";
import { FollowCard } from "./FollowCard";
import { SeriesFrame } from "./SeriesFrame";

// Everything a series reel shares: frame + badge, the voiceover, word captions, an SFX track mixed
// under the voice, and the follow-card tail after the last word. Scenes are written in seconds of
// the voiceover (see `Beat`), so retiming the voice never means hand-editing frame numbers.

export const FPS = 30;
export const TAIL_S = 2.2;
export const sec = (s: number) => Math.round(s * FPS);

export type Sfx = { at: number; file: string; db?: number };

export function Reel({
  series,
  episode,
  slug,
  captions,
  voSeconds,
  sfx = [],
  invert,
  children,
}: {
  series: SeriesKind;
  episode: number;
  slug: string;
  captions: CaptionWord[];
  voSeconds: number;
  sfx?: Sfx[];
  invert?: [number, number][];
  children: ReactNode;
}) {
  return (
    <SeriesFrame series={series} episode={episode} showHandle={false}>
      <AbsoluteFill>{children}</AbsoluteFill>
      <Captions words={captions} invert={invert} />
      <Audio src={staticFile(`reels/${slug}/vo.wav`)} />
      {sfx.map((s, i) => (
        <Sequence key={i} from={Math.max(0, sec(s.at) - 1)} durationInFrames={sec(3)} layout="none">
          <Audio src={staticFile(`sfx/${s.file}`)} volume={Math.pow(10, (s.db ?? -10) / 20)} />
        </Sequence>
      ))}
      <Sequence from={sec(voSeconds + 0.15)} name="follow tail">
        <FollowCard tapAt={22} />
      </Sequence>
    </SeriesFrame>
  );
}

export const reelFrames = (voSeconds: number) => sec(voSeconds + TAIL_S);

// A scene that lives from `from` to `to` seconds, with a soft blur-scale entrance/exit and a slow
// camera push across its hold, so a held beat never looks frozen.
export function Beat({
  from,
  to,
  children,
  push = 0.04,
  enter = true,
  exit = true,
  name,
}: {
  from: number;
  to: number;
  children: ReactNode;
  push?: number;
  enter?: boolean;
  exit?: boolean;
  name?: string;
}) {
  return (
    <Sequence from={sec(from)} durationInFrames={sec(to - from)} name={name}>
      <BeatInner dur={sec(to - from)} push={push} enter={enter} exit={exit}>
        {children}
      </BeatInner>
    </Sequence>
  );
}

function BeatInner({ dur, push, enter, exit, children }: { dur: number; push: number; enter: boolean; exit: boolean; children: ReactNode }) {
  const f = useCurrentFrame();
  const inP = enter ? interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }) : 1;
  const outP = exit ? interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) }) : 1;
  const scale = interpolate(f, [0, dur], [1, 1 + push], { easing: Easing.inOut(Easing.quad) }) * (0.96 + 0.04 * inP);
  return (
    <AbsoluteFill
      style={{
        opacity: Math.min(inP, outP),
        transform: `scale(${scale})`,
        transformOrigin: "50% 52%",
        filter: `blur(${(1 - Math.min(inP, outP)) * 8}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}

// Current time in seconds of the reel, inside a Beat: pass the Beat's `from`.
export function useSeconds(from = 0) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return f / fps + from;
}

// 0 -> 1 between two reel-times (seconds), eased.
export function ramp(t: number, a: number, b: number, easing = Easing.out(Easing.cubic)) {
  return interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

// Spring pop starting at reel-time `at` (seconds), given the Beat's `from`.
export function usePop(at: number, from: number, config = { damping: 13, stiffness: 170 }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - sec(at - from), fps, config });
}
