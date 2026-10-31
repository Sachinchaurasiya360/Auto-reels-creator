import type { ReactNode } from "react";
import { colors, fonts } from "./brand";

// A modern Android phone drawn at native vertical size: titanium edge, thin black bezel, punch-hole
// camera, status bar, side keys and a soft contact shadow. `children` is the screen (width x height
// of the screen area, in the phone's own pixels; it scales with `width`).

export const PHONE_RATIO = 2.08; // height / width of the body

export function Phone({
  width = 420,
  x,
  y,
  rotate = 0,
  tiltY = 0,
  dark = false,
  time = "12:30",
  children,
}: {
  width?: number;
  x: number;
  y: number;
  rotate?: number;
  tiltY?: number;
  dark?: boolean;
  time?: string;
  children?: ReactNode;
}) {
  const s = width / 420; // everything below is drawn for a 420px-wide phone
  const h = 420 * PHONE_RATIO;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 420,
        height: h,
        transformOrigin: "0 0",
        transform: `scale(${s}) perspective(1600px) rotateY(${tiltY}deg) rotate(${rotate}deg)`,
      }}
    >
      {/* contact shadow */}
      <div
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          bottom: -36,
          height: 60,
          borderRadius: "50%",
          background: "rgba(12,10,9,0.28)",
          filter: "blur(26px)",
        }}
      />
      {/* side keys */}
      <div style={{ position: "absolute", right: -5, top: 190, width: 6, height: 70, borderRadius: 3, background: "#9a9a9f" }} />
      <div style={{ position: "absolute", right: -5, top: 290, width: 6, height: 120, borderRadius: 3, background: "#9a9a9f" }} />
      {/* body: titanium edge -> bezel -> screen */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 64,
          background: "linear-gradient(145deg, #d9d9de 0%, #8e8e94 45%, #c9c9ce 100%)",
          padding: 5,
          boxShadow: "0 50px 90px -40px rgba(12,10,9,0.45)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 60, background: "#050505", padding: 12 }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: 50,
              overflow: "hidden",
              background: dark ? "#0b0b0d" : "#ffffff",
              color: dark ? "#fff" : colors.ink,
              fontFamily: fonts.body,
            }}
          >
            <StatusBar time={time} dark={dark} />
            <div style={{ position: "absolute", top: 52, left: 0, right: 0, bottom: 0 }}>{children}</div>
            {/* punch-hole camera */}
            <div style={{ position: "absolute", top: 16, left: "50%", marginLeft: -11, width: 22, height: 22, borderRadius: 999, background: "#000" }} />
            {/* glass sheen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Screen size for content laid out inside <Phone> (below the status bar), in the phone's own pixels.
export const PHONE_SCREEN = { w: 420 - 2 * 17, h: 420 * PHONE_RATIO - 2 * 17 - 52 };

function StatusBar({ time, dark }: { time: string; dark: boolean }) {
  const c = dark ? "#fff" : colors.ink;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "6px 34px 0",
        fontSize: 19,
        fontWeight: 600,
        color: c,
      }}
    >
      <span>{time}</span>
      <span style={{ display: "flex", gap: 7, alignItems: "center" }}>
        {/* signal */}
        <span style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          {[6, 9, 12, 15].map((hh) => (
            <span key={hh} style={{ width: 4, height: hh, borderRadius: 1, background: c }} />
          ))}
        </span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>5G</span>
        {/* battery */}
        <span style={{ position: "relative", width: 30, height: 15, borderRadius: 4, border: `2px solid ${c}`, padding: 2 }}>
          <span style={{ display: "block", width: "72%", height: "100%", borderRadius: 1.5, background: c }} />
        </span>
      </span>
    </div>
  );
}
