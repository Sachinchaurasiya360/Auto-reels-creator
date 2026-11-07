import { Img, staticFile } from "remotion";
import { colors, fonts } from "./brand";
import { ramp } from "./Reel";

// Real product screenshots (2026-11-07, PhotoCraft): a window frame around a screenshot with keyframed punch-ins,
// and a price card that can be struck through. Keys = [t, zoom, cx, cy] with cx/cy as fractions of the image.

export type ShotKey = [number, number, number, number];

function at(keys: ShotKey[], t: number): [number, number, number] {
  if (t <= keys[0][0]) return [keys[0][1], keys[0][2], keys[0][3]];
  for (let i = 1; i < keys.length; i++) {
    const [t1, z1, x1, y1] = keys[i];
    const [t0, z0, x0, y0] = keys[i - 1];
    if (t <= t1) {
      const p = ramp(t, t0, t1);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      return [z0 + (z1 - z0) * e, x0 + (x1 - x0) * e, y0 + (y1 - y0) * e];
    }
  }
  const k = keys[keys.length - 1];
  return [k[1], k[2], k[3]];
}

export function ProductShot({
  src,
  t,
  keys = [[0, 1, 0.5, 0.5]],
  x = 40,
  y = 600,
  w = 1000,
  h = 625,
  title,
  enter = 1,
}: {
  src: string; // path under public/
  t: number;
  keys?: ShotKey[];
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  title?: string;
  enter?: number; // 0-1 slide/scale in
}) {
  const [z, cx, cy] = at(keys, t);
  const bar = title ? 46 : 0;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h + bar,
        borderRadius: 22,
        overflow: "hidden",
        background: "#1e1e1e",
        boxShadow: "0 40px 90px -40px rgba(12,10,9,0.6)",
        border: "2px solid #2a2a2a",
        opacity: enter,
        transform: `translateY(${(1 - enter) * 60}px) scale(${0.94 + 0.06 * enter})`,
      }}
    >
      {title ? (
        <div style={{ height: bar, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: "#2a2a2a", fontFamily: fonts.mono, fontSize: 22, color: "#bbb" }}>
          <span style={{ width: 14, height: 14, borderRadius: 7, background: "#ff5f57" }} />
          <span style={{ width: 14, height: 14, borderRadius: 7, background: "#febc2e" }} />
          <span style={{ width: 14, height: 14, borderRadius: 7, background: "#28c840" }} />
          <span style={{ marginLeft: 12 }}>{title}</span>
        </div>
      ) : null}
      <div style={{ position: "relative", width: w, height: h, overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            width: w * z,
            height: h * z,
            left: Math.min(0, Math.max(w - w * z, w / 2 - cx * w * z)), // clamped: the frame never shows past the image edge
            top: Math.min(0, Math.max(h - h * z, h / 2 - cy * h * z)),
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}

export function PriceCard({
  label,
  price,
  per,
  strike = 0,
  stamp,
  stampIn = 0,
  tone = colors.ink,
}: {
  label: string;
  price: string;
  per?: string;
  strike?: number; // 0-1 red line drawn across the price
  stamp?: string; // big stamp text, e.g. "₹0"
  stampIn?: number;
  tone?: string;
}) {
  return (
    <div style={{ position: "relative", width: 900, padding: "44px 50px", borderRadius: 30, background: "#fff", border: `4px solid ${colors.ink}`, boxShadow: `12px 12px 0 ${colors.ink}`, fontFamily: fonts.display }}>
      <div style={{ fontSize: 40, fontWeight: 600, color: colors.muted }}>{label}</div>
      <div style={{ position: "relative", display: "inline-block", marginTop: 10 }}>
        <span style={{ fontSize: 150, fontWeight: 800, color: tone, letterSpacing: -4 }}>{price}</span>
        {per ? <span style={{ fontSize: 50, fontWeight: 600, color: colors.muted }}> {per}</span> : null}
        <div style={{ position: "absolute", left: -10, top: "52%", height: 14, width: `${strike * 104}%`, background: colors.red, borderRadius: 7, transform: "rotate(-4deg)" }} />
      </div>
      {stamp && stampIn > 0 ? (
        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 30,
            padding: "10px 34px",
            border: `8px solid ${colors.limeInk}`,
            borderRadius: 20,
            color: colors.limeInk,
            fontSize: 110,
            fontWeight: 800,
            transform: `rotate(-10deg) scale(${1.6 - 0.6 * stampIn})`,
            opacity: stampIn,
            background: "rgba(255,255,255,0.85)",
          }}
        >
          {stamp}
        </div>
      ) : null}
    </div>
  );
}
