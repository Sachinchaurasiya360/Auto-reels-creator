import type { CSSProperties, ReactNode } from "react";
import { Sequence } from "remotion";
import { safe } from "./brand";

// Puts a component built for another canvas (most library pieces assume 1920x1080) into the vertical frame.
//
// `design` is the canvas the child believes it has: <Sequence width height> overrides useVideoConfig()
// for everything below it, so components that size themselves from the video config lay out as designed.
// `focus` is the part of that canvas worth showing (library scenes often centre a small window in a
// big empty frame); it is scaled to `width` and placed at `x`/`y` in the real 1080x1920 frame.

export type Rect = { x: number; y: number; w: number; h: number };

export function Stage({
  design = { w: 1920, h: 1080 },
  focus,
  x = safe.left,
  y = 420,
  width = safe.right - safe.left,
  clip = true,
  name,
  style,
  children,
}: {
  design?: { w: number; h: number };
  focus?: Rect;
  x?: number;
  y?: number;
  width?: number;
  clip?: boolean;
  name?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const f = focus ?? { x: 0, y: 0, w: design.w, h: design.h };
  const s = width / f.w;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: f.h * s,
        overflow: clip ? "hidden" : "visible",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: design.w,
          height: design.h,
          transformOrigin: "0 0",
          transform: `translate(${-f.x * s}px, ${-f.y * s}px) scale(${s})`,
        }}
      >
        <Sequence width={design.w} height={design.h} name={name ?? "stage"}>
          {children}
        </Sequence>
      </div>
    </div>
  );
}

// Height in the real frame that a Stage with these settings will occupy.
export function stageHeight(focus: Rect, width = safe.right - safe.left) {
  return focus.h * (width / focus.w);
}
