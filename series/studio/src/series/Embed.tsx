import { colors, fonts } from "./brand";

// Embeddings scene pieces (2026-11-05, GitHub Pick Part 1: DigUp).
// `NumberSpace`: the "number duniya": every file piece (photo, PDF page, 30 s of audio, video frame) is a point placed
// by meaning; a typed query lands as a pin and lines run to its nearest points. Drawn in 2D only to show the idea;
// the real space has 768 numbers per point (EmbeddingGemma 2).
// `VectorStrip`: one piece's numbers, "[0.12, -0.41, … ×768]". `PieceChip`: a file piece (icon + label).

export type PieceKind = "photo" | "page" | "audio" | "frame" | "text";
const ICON: Record<PieceKind, string> = { photo: "🖼️", page: "📄", audio: "🎙️", frame: "🎞️", text: "🔤" };

export function PieceChip({ kind, label, glow = 0, small }: { kind: PieceKind; label: string; glow?: number; small?: boolean }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: colors.surface, border: `3px solid ${colors.ink}`, borderRadius: 12, padding: small ? "2px 10px" : "6px 14px", fontFamily: fonts.display, fontWeight: 700, fontSize: small ? 22 : 28, color: colors.ink, whiteSpace: "nowrap", boxShadow: glow > 0 ? `0 0 0 ${6 * glow}px ${colors.lime}, 3px 3px 0 ${colors.ink}` : `3px 3px 0 ${colors.ink}` }}>
      <span>{ICON[kind]}</span>
      {label}
    </div>
  );
}

export function VectorStrip({ values = [0.12, -0.41, 0.88, 0.05, -0.73, 0.31], count = 768, shown = 1, size = 30 }: { values?: number[]; count?: number; shown?: number; size?: number }) {
  const k = Math.max(0, Math.round(values.length * shown));
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, fontFamily: fonts.mono, fontWeight: 700, fontSize: size, color: "#e7e5e4", background: colors.code, borderRadius: 14, padding: "10px 18px", whiteSpace: "nowrap" }}>
      [
      {values.slice(0, k).map((v, i) => (
        <span key={i} style={{ color: v < 0 ? "#fca5a5" : "#93c5fd" }}>
          {v.toFixed(2)}
          {i < values.length - 1 ? "," : ""}
        </span>
      ))}
      <span style={{ color: colors.amber, opacity: shown >= 1 ? 1 : 0 }}>… ×{count}</span>]
    </div>
  );
}

export type SpacePoint = { id: string; kind: PieceKind; label: string; px: number; py: number; show?: number; glow?: number };

export function NumberSpace({
  x,
  y,
  w,
  h,
  points,
  query,
  nearest = [],
  link = 0,
  title = "number duniya",
  footer,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  points: SpacePoint[];
  query?: { label: string; px: number; py: number; show: number };
  nearest?: string[]; // ids to link to the query
  link?: number; // 0-1 draw progress of the links
  title?: string;
  footer?: string;
}) {
  const at = (p: { px: number; py: number }) => ({ x: p.px * w, y: p.py * h });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, height: h, borderRadius: 26, background: "#f5f5f4", border: `3px solid ${colors.ink}`, overflow: "hidden", backgroundImage: "radial-gradient(#d6d3d1 2px, transparent 2px)", backgroundSize: "34px 34px" }}>
      <div style={{ position: "absolute", left: 18, top: 12, fontFamily: fonts.mono, fontWeight: 700, fontSize: 24, color: colors.muted }}>// {title}</div>
      {footer ? <div style={{ position: "absolute", right: 18, bottom: 12, fontFamily: fonts.mono, fontWeight: 700, fontSize: 22, color: colors.muted }}>{footer}</div> : null}
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
        {query && link > 0
          ? nearest.map((id) => {
              const p = points.find((q) => q.id === id);
              if (!p) return null;
              const a = at(query);
              const b = at(p);
              return <line key={id} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * link} y2={a.y + (b.y - a.y) * link} stroke={colors.blue} strokeWidth={5} strokeDasharray="10 8" />;
            })
          : null}
      </svg>
      {points.map((p) => {
        const s = p.show ?? 1;
        if (s <= 0) return null;
        const q = at(p);
        return (
          <div key={p.id} style={{ position: "absolute", left: q.x, top: q.y, transform: `translate(-50%,-50%) scale(${s})` }}>
            <PieceChip kind={p.kind} label={p.label} glow={p.glow} small />
          </div>
        );
      })}
      {query && query.show > 0 ? (
        <div style={{ position: "absolute", left: at(query).x, top: at(query).y, transform: `translate(-50%,-100%) scale(${query.show})`, transformOrigin: "50% 100%", textAlign: "center" }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 26, color: "#fff", background: colors.blue, border: `3px solid ${colors.ink}`, borderRadius: 12, padding: "4px 12px", whiteSpace: "nowrap" }}>🔎 {query.label}</div>
          <div style={{ width: 4, height: 18, background: colors.ink, margin: "0 auto" }} />
          <div style={{ width: 18, height: 18, borderRadius: 99, background: colors.blue, border: `3px solid ${colors.ink}`, margin: "-2px auto 0" }} />
        </div>
      ) : null}
    </div>
  );
}
