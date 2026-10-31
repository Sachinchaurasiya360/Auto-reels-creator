import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";

// Kinetic Roman-Hinglish captions: the phrase being spoken builds word by word at the top of the
// frame (visuals own the middle). Keywords (`*word*` in script.txt) land at hero size in a blue pill.
// Input is the JSON from helpers/captions_roman.py.

export type CaptionWord = {
  text: string;
  startMs: number;
  endMs: number;
  speaker?: "narrator" | "interviewer" | "candidate";
  emphasis?: boolean;
  lineEnd?: boolean;
};

type Phrase = { words: CaptionWord[]; startMs: number; endMs: number; speaker?: CaptionWord["speaker"] };

const MAX_WORDS = 7;
const PAUSE_BREAK_MS = 380;
const HOLD_MS = 500;

export function toPhrases(words: CaptionWord[]): Phrase[] {
  const out: Phrase[] = [];
  let cur: CaptionWord[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({ words: cur, startMs: cur[0].startMs, endMs: cur[cur.length - 1].endMs, speaker: cur[0].speaker });
    cur = [];
  };
  words.forEach((w, i) => {
    const prev = words[i - 1];
    if (prev && (prev.speaker !== w.speaker || w.startMs - prev.endMs > PAUSE_BREAK_MS)) flush();
    cur.push(w);
    const sentenceEnd = /[.?!]$/.test(w.text.trim()) || w.lineEnd;
    const softEnd = /,$/.test(w.text.trim()) && cur.length >= 4;
    if (sentenceEnd || softEnd || cur.length >= MAX_WORDS) flush();
  });
  flush();
  return out;
}

const speakerStyle = {
  interviewer: { label: "Interviewer", bg: colors.ink, fg: "#fff" },
  candidate: { label: "Candidate", bg: colors.blue, fg: "#fff" },
} as const;

export function Captions({
  words,
  top = 340,
  offsetMs = 0,
  invert = [],
}: {
  words: CaptionWord[];
  top?: number;
  offsetMs?: number;
  invert?: [number, number][]; // seconds ranges where the ground is dark: support words turn light
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps) * 1000 + offsetMs;
  const phrases = useMemo(() => toPhrases(words), [words]);

  const idx = phrases.findIndex((p, i) => {
    const next = phrases[i + 1];
    const end = Math.min(p.endMs + HOLD_MS, next ? next.startMs : Infinity);
    return t >= p.startMs - 40 && t < end;
  });
  if (idx < 0) return null;
  const p = phrases[idx];
  const next = phrases[idx + 1];
  const end = Math.min(p.endMs + HOLD_MS, next ? next.startMs : Infinity);
  const exit = interpolate(t, [end - 140, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const spk = p.speaker && p.speaker !== "narrator" ? speakerStyle[p.speaker] : null;
  const dark = invert.some(([a, b]) => t / 1000 >= a && t / 1000 < b);

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 70,
        width: 870,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: exit,
        filter: `blur(${(1 - exit) * 6}px)`,
      }}
    >
      {spk ? (
        <div
          style={{
            padding: "8px 20px",
            borderRadius: 999,
            background: spk.bg,
            color: spk.fg,
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 14,
            opacity: interpolate(t - p.startMs, [-40, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {spk.label}
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          columnGap: 16,
          rowGap: 4,
          textAlign: "center",
        }}
      >
        {p.words.map((w, i) => {
          const local = t - w.startMs + 30;
          const inP = interpolate(local, [0, 130], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          });
          const word = w.text.trim();
          if (w.emphasis) {
            const slam = interpolate(local, [0, 180], [1.18, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.exp) });
            return (
              <span
                key={i}
                style={{
                  fontFamily: fonts.display,
                  fontWeight: 700,
                  fontSize: 92,
                  lineHeight: 1.1,
                  color: "#fff",
                  background: colors.blue,
                  padding: "0 18px 4px",
                  borderRadius: 18,
                  opacity: inP,
                  transform: `scale(${slam})`,
                  filter: `blur(${(1 - inP) * 6}px)`,
                  display: "inline-block",
                }}
              >
                {word}
              </span>
            );
          }
          return (
            <span
              key={i}
              style={{
                fontFamily: fonts.display,
                fontWeight: 600,
                fontSize: 62,
                lineHeight: 1.2,
                color: dark ? "#fff" : colors.ink,
                opacity: inP,
                transform: `translateY(${(1 - inP) * 10}px)`,
                filter: `blur(${(1 - inP) * 6}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
