import { colors, fonts } from "./brand";
import { usePopAt } from "./Story";

// The save frame (LESSONS 2026-11-05 stats entry, rule 3): the last seconds show a one-screen cheat sheet worth
// saving, rows popping in one by one, with a bookmark tab. Children of Reel (reel seconds).

export function SaveCard({ at, title, rows, y = 700, step = 0.35 }: { at: number; title: string; rows: { icon: string; text: string }[]; y?: number; step?: number }) {
  const s = usePopAt(at);
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: y, transform: `scale(${0.9 + 0.1 * s})`, opacity: s, background: colors.surface, border: `4px solid ${colors.ink}`, borderRadius: 30, padding: "34px 40px 30px", boxShadow: `10px 10px 0 ${colors.ink}` }}>
      <div style={{ position: "absolute", right: 46, top: -4, width: 64, height: 92, background: colors.blue, clipPath: "polygon(0 0,100% 0,100% 100%,50% 76%,0 100%)" }} />
      <div style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: colors.muted }}>save karo 🔖 interview se pehle</div>
      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, color: colors.ink, marginTop: 6, lineHeight: 1.1 }}>{title}</div>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 14 }}>
        {rows.map((r, i) => (
          <Row key={r.text} at={at + 0.25 + i * step} icon={r.icon} text={r.text} n={i + 1} />
        ))}
      </div>
    </div>
  );
}

function Row({ at, icon, text, n }: { at: number; icon: string; text: string; n: number }) {
  const s = usePopAt(at);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: s, transform: `translateX(${(1 - s) * 40}px)` }}>
      <span style={{ fontFamily: fonts.mono, fontWeight: 700, fontSize: 28, color: "#fff", background: colors.ink, borderRadius: 10, padding: "2px 12px" }}>{n}</span>
      <span style={{ fontSize: 40 }}>{icon}</span>
      <span style={{ fontFamily: fonts.body, fontWeight: 700, fontSize: 36, color: colors.ink, lineHeight: 1.2 }}>{text}</span>
    </div>
  );
}
