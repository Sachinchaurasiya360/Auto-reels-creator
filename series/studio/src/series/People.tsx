import { interpolate } from "remotion";
import { colors, fonts } from "./brand";
import type { CaptionWord } from "./Captions";

// Drawn people for series reels: an illustrated bust (`Person`) and a video-call tile
// (`CallTile`) for interview episodes, so the interviewer and the candidate are always on screen.

export type Look = {
  skin: string;
  hair: string;
  shirt: string;
  hairStyle: "short" | "long" | "bun" | "bald";
  glasses?: boolean;
  beard?: boolean;
};

export const looks = {
  interviewer: { skin: "#c68863", hair: "#2b2118", shirt: "#334155", hairStyle: "short", glasses: true, beard: true },
  candidate: { skin: "#d9a07a", hair: "#1c1917", shirt: "#0074ff", hairStyle: "long" },
  student: { skin: "#b97a56", hair: "#1c1917", shirt: "#16a34a", hairStyle: "short" },
  mom: { skin: "#c68863", hair: "#3f3f46", shirt: "#be185d", hairStyle: "bun" },
  dakiya: { skin: "#b97a56", hair: "#3f3f46", shirt: "#a16207", hairStyle: "short", beard: true }, // postman / counter uncle (khaki)
} satisfies Record<string, Look>;

// A head-and-shoulders bust in a 200x220 box. `talk` (0-1) opens the mouth.
export function Person({ look, size = 200, talk = 0, mood = "neutral" }: { look: Look; size?: number; talk?: number; mood?: "neutral" | "happy" | "shocked" }) {
  const mouthOpen = mood === "shocked" ? 10 : talk * 9;
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 200 220">
      {/* shoulders */}
      <path d="M18 220 Q22 160 100 152 Q178 160 182 220 Z" fill={look.shirt} />
      <path d="M80 154 L100 180 L120 154" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={4} />
      <rect x={86} y={128} width={28} height={30} rx={10} fill={look.skin} />
      {/* hair back: two side strands falling past the ears onto the shoulders */}
      {look.hairStyle === "long" ? (
        <g fill={look.hair}>
          <path d="M52 76 Q34 150 56 194 L86 188 Q68 140 72 96 Z" />
          <path d="M148 76 Q166 150 144 194 L114 188 Q132 140 128 96 Z" />
        </g>
      ) : null}
      {look.hairStyle === "bun" ? <circle cx={100} cy={30} r={22} fill={look.hair} /> : null}
      {/* head */}
      <ellipse cx={100} cy={88} rx={50} ry={56} fill={look.skin} />
      <ellipse cx={50} cy={92} rx={8} ry={12} fill={look.skin} />
      <ellipse cx={150} cy={92} rx={8} ry={12} fill={look.skin} />
      {/* hair front */}
      {look.hairStyle === "short" ? <path d="M50 82 Q48 30 100 30 Q154 30 150 82 Q140 54 100 52 Q64 54 50 82 Z" fill={look.hair} /> : null}
      {look.hairStyle === "long" ? <path d="M50 92 Q46 28 100 30 Q156 28 150 92 Q144 56 112 50 Q80 62 50 92 Z" fill={look.hair} /> : null}
      {look.hairStyle === "bun" ? <path d="M52 80 Q54 40 100 40 Q146 40 148 80 Q136 58 100 56 Q66 58 52 80 Z" fill={look.hair} /> : null}
      {look.beard ? <path d="M56 100 Q60 146 100 148 Q140 146 144 100 Q132 128 100 130 Q68 128 56 100 Z" fill={look.hair} opacity={0.85} /> : null}
      {/* eyes */}
      <ellipse cx={80} cy={90} rx={5} ry={mood === "shocked" ? 7 : 5.5} fill="#1c1917" />
      <ellipse cx={120} cy={90} rx={5} ry={mood === "shocked" ? 7 : 5.5} fill="#1c1917" />
      <path d="M68 76 Q80 70 90 75" stroke={look.hair} strokeWidth={4} fill="none" strokeLinecap="round" />
      <path d="M110 75 Q120 70 132 76" stroke={look.hair} strokeWidth={4} fill="none" strokeLinecap="round" />
      {look.glasses ? (
        <g fill="none" stroke="#1c1917" strokeWidth={3.5}>
          <rect x={64} y={78} width={32} height={24} rx={8} />
          <rect x={104} y={78} width={32} height={24} rx={8} />
          <path d="M96 88 H104" />
        </g>
      ) : null}
      {/* mouth */}
      {mouthOpen > 1 ? (
        <ellipse cx={100} cy={120} rx={mood === "shocked" ? 8 : 12} ry={mouthOpen} fill="#7f1d1d" />
      ) : (
        <path d={mood === "happy" ? "M84 116 Q100 132 116 116" : "M86 120 Q100 126 114 120"} stroke="#7f1d1d" strokeWidth={4} fill="none" strokeLinecap="round" />
      )}
    </svg>
  );
}

// A video-call tile: tinted backdrop, the person, a name chip and a green ring + bars while speaking.
export function CallTile({
  x,
  y,
  width = 440,
  height = 360,
  look,
  name,
  role,
  speaking = 0,
  talk = 0,
  mood,
  tint = "#e7e5e4",
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  look: Look;
  name: string;
  role: string;
  speaking?: number;
  talk?: number;
  mood?: "neutral" | "happy" | "shocked";
  tint?: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 34,
        overflow: "hidden",
        background: `linear-gradient(170deg, ${tint} 0%, #ffffff 120%)`,
        boxShadow: `0 30px 60px -30px rgba(12,10,9,0.35), 0 0 0 ${interpolate(speaking, [0, 1], [2, 7])}px ${speaking > 0.05 ? colors.lime : colors.border}`,
      }}
    >
      <div style={{ position: "absolute", left: "50%", bottom: -4, transform: "translateX(-50%)" }}>
        <Person look={look} size={height * 0.78} talk={talk} mood={mood} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 18,
          bottom: 18,
          padding: "8px 18px",
          borderRadius: 14,
          background: "rgba(12,10,9,0.72)",
          color: "#fff",
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 32,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        {name}
        <span style={{ fontWeight: 500, fontSize: 24, opacity: 0.75 }}>{role}</span>
      </div>
      {speaking > 0.05 ? (
        <div style={{ position: "absolute", right: 22, top: 22, display: "flex", gap: 5, alignItems: "flex-end", height: 36 }}>
          {[0.5, 1, 0.7].map((h, i) => (
            <div key={i} style={{ width: 9, height: 36 * h * (0.4 + 0.6 * speaking), borderRadius: 5, background: colors.lime }} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

type Mood = "neutral" | "happy" | "shocked";

// Interviewer + candidate side by side, centred on the frame. `speaker` lights one tile.
export function CallPair({
  y,
  h,
  w = 445,
  speaker,
  talk = 0,
  iMood,
  cMood,
  names = ["Arjun", "Priya"],
}: {
  y: number;
  h: number;
  w?: number;
  speaker?: "i" | "c";
  talk?: number;
  iMood?: Mood;
  cMood?: Mood;
  names?: [string, string];
}) {
  return (
    <>
      <CallTile x={540 - w - 12} y={y} width={w} height={h} look={looks.interviewer} name={names[0]} role="Interviewer" speaking={speaker === "i" ? 1 : 0} talk={speaker === "i" ? talk : 0} mood={iMood} tint="#e2e8f0" />
      <CallTile x={552} y={y} width={w} height={h} look={looks.candidate} name={names[1]} role="Candidate" speaking={speaker === "c" ? 1 : 0} talk={speaker === "c" ? talk : 0} mood={cMood} tint="#dbeafe" />
    </>
  );
}

// Interviewer + candidate whose speaking ring and mouth follow the reel's captions at reel-time `t`
// (words tagged speaker "interviewer" / "candidate"); narrator lines leave both quiet.
export function CaptionCall({
  t,
  captions,
  y = 560,
  h = 190,
  w = 300,
  iMood,
  cMood,
}: {
  t: number;
  captions: CaptionWord[];
  y?: number;
  h?: number;
  w?: number;
  iMood?: Mood;
  cMood?: Mood;
}) {
  const ms = t * 1000;
  const word = captions.find((c) => ms >= c.startMs && ms < c.endMs + 120);
  const speaker = word?.speaker === "interviewer" ? "i" : word?.speaker === "candidate" ? "c" : undefined;
  const talk = speaker ? 0.5 + 0.5 * Math.sin(t * 22) : 0;
  return <CallPair y={y} h={h} w={w} speaker={speaker} talk={talk} iMood={iMood} cMood={cMood} />;
}
