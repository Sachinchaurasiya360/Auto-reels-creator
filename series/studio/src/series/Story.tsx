import type { ReactNode } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors, fonts } from "./brand";
import { sec } from "./Reel";

// The one-building-scene pattern from the junior's reel (series/references/junior-part1-*, LESSONS 2026-11-03):
// a "// scene" label, one scene whose objects stay and grow, a legend of concept chips that accumulates as each
// idea is named, and a camera that moves over the same scene instead of cutting to new ones.
// Use as direct children of `Reel` (no Beat), so times are plain reel seconds.

export type LegendItem = { at: number; label: string; color?: string; fg?: string };

// "// dakghar" code-comment label above the scene.
export function SceneLabel({ text, y = 490, at = 0 }: { text: string; y?: number; at?: number }) {
  const s = usePopAt(at);
  return (
    <div style={{ position: "absolute", top: y, left: 0, width: "100%", display: "flex", justifyContent: "center", opacity: s, transform: `scale(${0.9 + 0.1 * s})` }}>
      <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 32, color: colors.muted, background: colors.surface, border: `3px solid ${colors.ink}`, borderRadius: 14, padding: "6px 20px", boxShadow: `5px 5px 0 ${colors.ink}` }}>
        // {text}
      </div>
    </div>
  );
}

// Concept chips that pile up as each idea is named; the newest one is ringed for a second.
export function Legend({ items, y = 560 }: { items: LegendItem[]; y?: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const shown = items.filter((i) => f >= sec(i.at) - 1);
  return (
    <div style={{ position: "absolute", top: y, left: 70, right: 70, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
      {shown.map((i) => {
        const s = spring({ frame: f - sec(i.at), fps, config: { damping: 11, stiffness: 190 } });
        const fresh = f - sec(i.at) < fps * 1.2;
        return (
          <div
            key={i.label}
            style={{
              transform: `scale(${s}) rotate(${fresh ? -2 : 0}deg)`,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 30,
              color: i.fg ?? "#fff",
              background: i.color ?? colors.blue,
              border: `3px solid ${colors.ink}`,
              borderRadius: 14,
              padding: "6px 18px",
              boxShadow: fresh ? `0 0 0 8px ${colors.amber}88, 4px 4px 0 ${colors.ink}` : `4px 4px 0 ${colors.ink}`,
            }}
          >
            {i.label}
          </div>
        );
      })}
    </div>
  );
}

// One camera over one scene: zoom and pan between keyframes (reel seconds). x/y is the scene point kept centred.
export type CamKey = { at: number; zoom?: number; x?: number; y?: number };
// `anchor` is where on screen that point sits; keep it in the content band (below the header) so zooms stay readable.
export function Camera({ t, keys, children, dur = 0.5, anchor = { x: 540, y: 960 } }: { t: number; keys: CamKey[]; children: ReactNode; dur?: number; anchor?: { x: number; y: number } }) {
  let cur = { zoom: 1, x: anchor.x, y: anchor.y };
  for (const k of keys) {
    if (t < k.at) break;
    const p = interpolate(t, [k.at, k.at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });
    const next = { zoom: k.zoom ?? cur.zoom, x: k.x ?? cur.x, y: k.y ?? cur.y };
    cur = { zoom: cur.zoom + (next.zoom - cur.zoom) * p, x: cur.x + (next.x - cur.x) * p, y: cur.y + (next.y - cur.y) * p };
  }
  const tx = anchor.x - cur.x * cur.zoom;
  const ty = anchor.y - cur.y * cur.zoom;
  return <div style={{ position: "absolute", inset: 0, transformOrigin: "0 0", transform: `translate(${tx}px, ${ty}px) scale(${cur.zoom})` }}>{children}</div>;
}

// Ground-coloured band behind the badge, captions, scene label and legend, so a zoomed scene slides under it cleanly.
export function HeaderBand({ bottom = 700 }: { bottom?: number }) {
  return <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: bottom, background: `linear-gradient(180deg, ${colors.ground} 0%, ${colors.ground} 92%, ${colors.ground}00 100%)` }} />;
}

// Spring pop at reel-time `at` for children of Reel (global frame).
export function usePopAt(at: number, config = { damping: 13, stiffness: 170 }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - sec(at), fps, config });
}

// A thing shown only between two reel-times, popping in and fading out.
export function Moment({ t, from, to, x, y, rotate = 0, children }: { t: number; from: number; to: number; x: number; y: number; rotate?: number; children: ReactNode }) {
  const s = usePopAt(from);
  const out = interpolate(t, [to - 0.2, to], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t < from - 0.05 || t > to) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: `scale(${s}) rotate(${rotate}deg)`, transformOrigin: "50% 50%", opacity: out }}>{children}</div>;
}
