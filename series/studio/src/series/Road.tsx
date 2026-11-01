import { colors, fonts } from "./brand";

// Road and toll-plaza props, drawn (no images). Side view: the car faces right, the gantry spans the
// lane, the boom barrier sits on the exit side. All sizes in canvas pixels.

// A side-view hatchback. `tag` draws the FASTag sticker at the top of the windshield (glows with `tagGlow`).
export function Car({
  x,
  y,
  width = 640,
  body = colors.blue,
  tag = true,
  tagGlow = 0,
  wheelTurn = 0,
}: {
  x: number;
  y: number;
  width?: number;
  body?: string;
  tag?: boolean;
  tagGlow?: number;
  wheelTurn?: number;
}) {
  const s = width / 600;
  return (
    <svg
      style={{ position: "absolute", left: x, top: y, overflow: "visible" }}
      width={600 * s}
      height={230 * s}
      viewBox="0 0 600 230"
    >
      <ellipse cx={300} cy={214} rx={270} ry={14} fill="rgba(12,10,9,0.22)" />
      {/* body */}
      <path
        d="M30 168 Q26 132 62 122 L150 108 Q196 52 250 44 L392 42 Q436 44 470 92 L540 104 Q574 112 578 140 L580 170 Q580 186 564 186 L44 186 Q30 186 30 168 Z"
        fill={body}
      />
      <path d="M30 150 L580 150" stroke="rgba(255,255,255,0.18)" strokeWidth={4} />
      {/* windows */}
      <path d="M176 110 Q210 64 252 58 L312 57 L312 110 Z" fill="#cfe3f5" />
      <path d="M326 57 L388 57 Q424 60 452 108 L326 110 Z" fill="#cfe3f5" />
      <path d="M190 104 Q214 76 240 68" stroke="#fff" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      {/* door line + handle */}
      <path d="M318 112 L318 182" stroke="rgba(0,0,0,0.18)" strokeWidth={3} />
      <rect x={340} y={124} width={34} height={8} rx={4} fill="rgba(0,0,0,0.25)" />
      {/* lights */}
      <rect x={556} y={124} width={22} height={14} rx={5} fill="#fff7c2" />
      <rect x={30} y={128} width={14} height={16} rx={4} fill="#ff6b6b" />
      {/* FASTag sticker, top of the windshield behind the mirror */}
      {tag ? (
        <g>
          {tagGlow > 0 ? <circle cx={428} cy={74} r={20 + tagGlow * 26} fill={colors.lime} opacity={0.35 * tagGlow} /> : null}
          <rect x={414} y={64} width={30} height={20} rx={3} fill="#fff" stroke={colors.ink} strokeWidth={2} transform="rotate(48 429 74)" />
        </g>
      ) : null}
      {/* wheels */}
      {[150, 466].map((cx) => (
        <g key={cx} transform={`rotate(${wheelTurn} ${cx} 186)`}>
          <circle cx={cx} cy={186} r={40} fill="#1c1917" />
          <circle cx={cx} cy={186} r={22} fill="#a8a29e" />
          {[0, 72, 144, 216, 288].map((a) => (
            <rect key={a} x={cx - 3} y={166} width={6} height={20} rx={2} fill="#57534e" transform={`rotate(${a} ${cx} 186)`} />
          ))}
        </g>
      ))}
    </svg>
  );
}

// Toll gantry over the lane: two posts, a beam with the lane sign, and the RFID reader box.
// `waves` (0-1) draws radio arcs going down from the reader.
export function TollGantry({ x, y, width = 760, height = 620, waves = 0 }: { x: number; y: number; width?: number; height?: number; waves?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y, width, height }}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 34, bottom: 0, background: "linear-gradient(90deg,#d6d3d1,#a8a29e)", borderRadius: 6 }} />
      <div style={{ position: "absolute", right: 0, top: 60, width: 34, bottom: 0, background: "linear-gradient(90deg,#d6d3d1,#a8a29e)", borderRadius: 6 }} />
      <div
        style={{
          position: "absolute",
          left: -20,
          right: -20,
          top: 0,
          height: 96,
          borderRadius: 14,
          background: "#14532d",
          border: "5px solid #e7e5e4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          color: "#fff",
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 46,
          letterSpacing: 1,
        }}
      >
        <span style={{ background: "#fff", color: "#14532d", borderRadius: 10, padding: "0 14px", fontSize: 40 }}>FASTag</span>
        LANE ONLY
      </div>
      {/* reader */}
      <div style={{ position: "absolute", left: width / 2 - 60, top: 108, width: 120, height: 56, borderRadius: 10, background: colors.code, border: "4px solid #57534e" }}>
        <div style={{ position: "absolute", right: 12, top: 18, width: 14, height: 14, borderRadius: 99, background: waves > 0 ? colors.lime : "#3f3f46" }} />
      </div>
      {waves > 0
        ? [0, 1, 2].map((i) => {
            const r = 60 + i * 70;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: width / 2 - r,
                  top: 164 - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: "50%",
                  border: `6px solid ${colors.lime}`,
                  clipPath: "inset(50% 0 0 0)",
                  opacity: waves * (1 - i * 0.28),
                }}
              />
            );
          })
        : null}
    </div>
  );
}

// Boom barrier: post on the ground at (x, y = ground line); arm angle 0 = closed, -82 = open.
export function BoomBarrier({ x, y, length = 520, angle = 0 }: { x: number; y: number; length?: number; angle?: number }) {
  return (
    <div style={{ position: "absolute", left: x, top: y - 230, width: 70, height: 230 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "#facc15", border: "4px solid #a16207" }} />
      <div
        style={{
          position: "absolute",
          left: 35,
          top: 40,
          width: length,
          height: 30,
          marginTop: -15,
          transformOrigin: "0 50%",
          transform: `rotate(${-angle}deg) scaleX(-1)`,
          borderRadius: 15,
          background: "repeating-linear-gradient(90deg,#ef4444 0 60px,#ffffff 60px 120px)",
          border: "3px solid #7f1d1d",
        }}
      />
      <div style={{ position: "absolute", left: 20, top: 25, width: 30, height: 30, borderRadius: 99, background: "#1c1917" }} />
    </div>
  );
}

// The road strip with lane dashes. Lane edge at `y`.
export function Road({ y, height = 210 }: { y: number; height?: number }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, height, background: "#44403c" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 10, background: "#d6d3d1" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: height / 2, height: 12, background: "repeating-linear-gradient(90deg,#fafaf9 0 90px,transparent 90px 170px)" }} />
    </div>
  );
}

// The FASTag sticker itself, close up (front face). `rows` writes what's in the chip.
export function FastagSticker({ x, y, width = 620, glow = 0 }: { x: number; y: number; width?: number; glow?: number }) {
  const h = width * 0.56;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height: h,
        borderRadius: 26,
        background: "#ffffff",
        boxShadow: `0 40px 80px -30px rgba(12,10,9,0.4), 0 0 0 ${glow * 14}px rgba(163,230,53,${0.5 * glow})`,
        overflow: "hidden",
        fontFamily: fonts.display,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "38%", background: "linear-gradient(160deg,#16a34a,#14532d)" }} />
      <div style={{ position: "absolute", left: "5%", top: "12%", color: "#fff", fontSize: width * 0.085, fontWeight: 700 }}>FASTag</div>
      <div style={{ position: "absolute", left: "5%", top: "34%", color: "#dcfce7", fontSize: width * 0.04, fontWeight: 600, width: "30%", lineHeight: 1.2 }}>
        Electronic Toll Collection
      </div>
      {/* the antenna coil, visible through the sticker */}
      <svg style={{ position: "absolute", left: "44%", top: "14%" }} width={width * 0.5} height={h * 0.72} viewBox="0 0 300 160">
        <path
          d="M10 80 H60 V20 H240 V140 H60 V80 M80 80 V40 H220 V120 H80 V80 M100 80 V60 H200 V100 H100"
          fill="none"
          stroke="#b45309"
          strokeWidth={6}
        />
        <rect x={136} y={70} width={28} height={20} rx={3} fill="#1c1917" />
        <path d="M240 80 H290" stroke="#b45309" strokeWidth={6} />
      </svg>
      <div style={{ position: "absolute", left: "5%", bottom: "9%", color: "#fff", fontFamily: fonts.mono, fontSize: width * 0.032 }}>
        34161FA82033E7E4
      </div>
    </div>
  );
}
