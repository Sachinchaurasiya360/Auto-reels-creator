import { colors, fonts } from "./brand";

// Terminal-first scene (2026-11-07): a big dark terminal where real commands type in (`typed` = characters shown
// across all lines, so one number drives the whole session) and an AWS pipeline strip whose services light up as
// the commands create them. Commands shown must be copied from docs (research.md), never invented.

export type TermLine = { cmd?: string; out?: string; tone?: "ok" | "err" | "dim" };

export function Terminal({ x, y, w, h, title = "~/notesdrop", lines, typed = 1e9, size = 30 }: { x: number; y: number; w: number; h: number; title?: string; lines: TermLine[]; typed?: number; size?: number }) {
  let budget = typed;
  const rows: { text: string; kind: "cmd" | "out"; tone?: TermLine["tone"]; caret: boolean }[] = [];
  for (const l of lines) {
    if (budget <= 0) break;
    if (l.cmd) {
      const n = Math.min(l.cmd.length, budget);
      budget -= l.cmd.length;
      rows.push({ text: l.cmd.slice(0, n), kind: "cmd", caret: budget < 0 });
      if (budget < 0) break;
    }
    if (l.out) {
      rows.push({ text: l.out, kind: "out", tone: l.tone, caret: false });
      budget -= 6; // a beat for the output to land
    }
  }
  const toneColor = (t?: TermLine["tone"]) => (t === "ok" ? "#a3e635" : t === "err" ? "#f87171" : "#94a3b8");
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 28, background: colors.code, overflow: "hidden", boxShadow: "0 50px 100px -40px rgba(0,0,0,0.75)", border: "2px solid #262b36" }}>
      <div style={{ height: 64, display: "flex", alignItems: "center", gap: 14, padding: "0 26px", background: "#171a21" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />
        ))}
        <div style={{ marginLeft: 16, fontFamily: fonts.mono, fontSize: 24, color: "#94a3b8" }}>{title}</div>
      </div>
      <div style={{ padding: "26px 30px", fontFamily: fonts.mono, fontSize: size, lineHeight: 1.45, color: "#e2e8f0", display: "flex", flexDirection: "column", justifyContent: "flex-end", height: h - 64 - 52 }}>
        {rows.slice(-12).map((r, i) => (
          <div key={i} style={{ whiteSpace: "pre-wrap", wordBreak: "break-all", color: r.kind === "out" ? toneColor(r.tone) : "#e2e8f0" }}>
            {r.kind === "cmd" ? <span style={{ color: "#a3e635" }}>$ </span> : null}
            {r.text}
            {r.caret ? <span style={{ display: "inline-block", width: size * 0.55, height: size, background: "#e2e8f0", verticalAlign: "middle", marginLeft: 2 }} /> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export type Service = { id: string; name: string; sub: string; glyph: "s3" | "lambda" | "dynamo" | "floci" | "link" };

const Glyph = ({ g, on }: { g: Service["glyph"]; on: boolean }) => {
  const c = on ? "#fff" : "#94a3b8";
  if (g === "lambda") return <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 64, color: c, lineHeight: 1 }}>λ</div>;
  if (g === "s3")
    return (
      <svg width={64} height={64} viewBox="0 0 64 64">
        <path d="M10 16 L54 16 L48 56 L16 56 Z" fill="none" stroke={c} strokeWidth={5} strokeLinejoin="round" />
        <ellipse cx={32} cy={16} rx={22} ry={7} fill="none" stroke={c} strokeWidth={5} />
      </svg>
    );
  if (g === "dynamo")
    return (
      <svg width={64} height={64} viewBox="0 0 64 64">
        {[14, 30, 46].map((yy) => (
          <ellipse key={yy} cx={32} cy={yy} rx={22} ry={8} fill="none" stroke={c} strokeWidth={5} />
        ))}
      </svg>
    );
  if (g === "link") return <div style={{ fontSize: 54, lineHeight: 1 }}>🔗</div>;
  return <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 30, color: c }}>:4566</div>;
};

const svcColor: Record<Service["glyph"], string> = { s3: "#3f8624", lambda: "#e7711b", dynamo: "#3b48cc", floci: colors.blue, link: "#0f766e" };

// services in a row with arrows; `lit` = how many are on; `pulse` 0-1 moves a file chip along arrow index `pulseOn`
export function Pipeline({ x, y, w, services, lit, pulse, pulseOn = 0, chip = "PDF" }: { x: number; y: number; w: number; services: Service[]; lit: number; pulse?: number; pulseOn?: number; chip?: string }) {
  const n = services.length;
  const gap = 46;
  const bw = (w - gap * (n - 1)) / n;
  const bh = 200;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: bh }}>
      {services.map((s, i) => {
        const on = i < lit;
        return (
          <div key={s.id} style={{ position: "absolute", left: i * (bw + gap), top: 0, width: bw, height: bh, borderRadius: 26, background: on ? svcColor[s.glyph] : "#fff", border: `3px solid ${on ? svcColor[s.glyph] : colors.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: on ? `0 24px 50px -24px ${svcColor[s.glyph]}` : "none" }}>
            <Glyph g={s.glyph} on={on} />
            <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 34, color: on ? "#fff" : colors.muted }}>{s.name}</div>
            <div style={{ fontFamily: fonts.mono, fontSize: 20, color: on ? "rgba(255,255,255,0.85)" : colors.faint }}>{s.sub}</div>
          </div>
        );
      })}
      {services.slice(1).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: (i + 1) * (bw + gap) - gap + 6, top: bh / 2 - 4, width: gap - 12, height: 8, borderRadius: 4, background: i + 1 < lit ? colors.ink : colors.border }} />
      ))}
      {pulse !== undefined && pulse > 0 && pulse < 1 ? (
        <div style={{ position: "absolute", left: pulseOn * (bw + gap) + bw / 2 + pulse * (bw + gap) - 50, top: -62, padding: "8px 16px", borderRadius: 12, background: colors.red, color: "#fff", fontFamily: fonts.mono, fontWeight: 700, fontSize: 24 }}>{chip}</div>
      ) : null}
    </div>
  );
}
