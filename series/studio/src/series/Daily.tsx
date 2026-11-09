import { colors, fonts } from "./brand";
import { ramp } from "./Reel";

// Daily-series pieces from the @automationmentor security-audit reference (LESSONS 2026-11-09 night):
// StreakStrip (follow reason for a daily series), StepTracker (phases that stay on screen and tick done),
// ProfileCta (the CTA acted out: Follow -> Following, keyword typed as a comment, our reply "Sent").

// "Day N" with chips 1..total, done ones ticked, today's lit.
export function StreakStrip({ t, at, day, total = 15, label = "Day", sub, y = 760, x = 90, w = 900 }: { t: number; at: number; day: number; total?: number; label?: string; sub?: string; y?: number; x?: number; w?: number }) {
  const enter = at <= 0 ? 1 : ramp(t, at, at + 0.3);
  const shown = Math.min(total, 10);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "40px 44px", borderRadius: 34, background: colors.code, color: "#fff", opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`, fontFamily: fonts.display }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ fontFamily: fonts.serif, fontStyle: "italic", fontSize: 110, lineHeight: 1 }}>{label}</span>
        <span style={{ fontSize: 140, fontWeight: 700, lineHeight: 1, color: colors.lime }}>{String(day).padStart(2, "0")}</span>
        <span style={{ marginLeft: "auto", fontSize: 30, color: "#a8a29e", fontWeight: 600 }}>/ {total}</span>
      </div>
      {sub ? <div style={{ marginTop: 10, fontSize: 36, color: "#d6d3d1", fontWeight: 600 }}>{sub}</div> : null}
      <div style={{ marginTop: 30, display: "flex", gap: 14 }}>
        {Array.from({ length: shown }, (_, i) => {
          const n = i + 1;
          const lit = n === day;
          const done = n < day;
          const pop = ramp(t, at + 0.3 + i * 0.06, at + 0.5 + i * 0.06);
          return (
            <div key={n} style={{ width: 66, height: 78, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700, background: lit ? colors.lime : done ? "#3f3f46" : "transparent", color: lit ? colors.ink : done ? "#fff" : "#71717a", border: lit || done ? "none" : "2px solid #3f3f46", transform: `scale(${(0.6 + 0.4 * pop) * (lit ? 1.12 : 1)})`, opacity: pop }}>
              {done ? "✓" : n}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type Step = { label: string; at: number }; // `at` = second the step becomes active; the next step's `at` marks it done

// Phases that stay on screen through the mechanism. Steps before the active one are ticked.
export function StepTracker({ t, title, steps, y = 1120, x = 70, w = 940, show = 1 }: { t: number; title: string; steps: Step[]; y?: number; x?: number; w?: number; show?: number }) {
  const active = steps.reduce((a, s, i) => (t >= s.at ? i : a), -1);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "26px 30px", borderRadius: 28, background: "#fff", border: `2px solid ${colors.border}`, boxShadow: "0 30px 60px -30px rgba(12,10,9,0.35)", opacity: show, transform: `translateY(${(1 - show) * 40}px)`, fontFamily: fonts.body }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 30 }}>⌘ {title}</span>
        <span style={{ fontFamily: fonts.mono, fontSize: 24, color: colors.muted }}>
          step {Math.max(0, active + 1)} / {steps.length}
        </span>
      </div>
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        {steps.map((s, i) => {
          const done = i < active;
          const now = i === active;
          return (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: now ? 700 : 500, color: i > active ? colors.faint : colors.ink }}>
              <span style={{ width: 42, height: 42, borderRadius: 21, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, background: done ? colors.limeInk : now ? colors.blue : colors.surfaceAlt, color: done || now ? "#fff" : colors.faint, boxShadow: now ? `0 0 0 ${6 + 3 * Math.sin(t * 6)}px ${colors.blueSoft}` : "none" }}>
                {done ? "✓" : i + 1}
              </span>
              <span>{s.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 18, height: 10, borderRadius: 5, background: colors.surfaceAlt, overflow: "hidden" }}>
        <div style={{ width: `${(100 * Math.max(0, active + 1)) / steps.length}%`, height: "100%", background: colors.limeInk }} />
      </div>
    </div>
  );
}

// The CTA acted out on a profile card: follow tap, keyword comment typed, our reply lands.
export function ProfileCta({ t, at, word, followAt, commentAt, replyAt, handle = "intern.hack", name = "InternHack", bio = "Har din ek free skill · Claude se Reels", y = 640 }: { t: number; at: number; word: string; followAt: number; commentAt: number; replyAt: number; handle?: string; name?: string; bio?: string; y?: number }) {
  const enter = ramp(t, at, at + 0.3);
  const followed = t >= followAt;
  const press = 1 - 0.07 * Math.sin(Math.min(1, Math.max(0, (t - followAt) / 0.2)) * Math.PI);
  const typed = Math.floor(ramp(t, commentAt, commentAt + 0.15 * word.length, (x) => x) * word.length);
  const reply = ramp(t, replyAt, replyAt + 0.3);
  return (
    <div style={{ position: "absolute", left: 90, top: y, width: 900, opacity: enter, transform: `translateY(${(1 - enter) * 50}px)`, fontFamily: fonts.body }}>
      <div style={{ padding: 36, borderRadius: 32, background: "#fff", border: `2px solid ${colors.border}`, boxShadow: "0 40px 80px -36px rgba(12,10,9,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: colors.ink, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontSize: 48, fontWeight: 800 }}>H</div>
          <div>
            <div style={{ fontFamily: fonts.display, fontSize: 40, fontWeight: 700 }}>{name}</div>
            <div style={{ fontSize: 26, color: colors.muted }}>@{handle} · {bio}</div>
          </div>
        </div>
        <div style={{ marginTop: 26, padding: "18px 0", borderRadius: 16, textAlign: "center", fontFamily: fonts.display, fontSize: 34, fontWeight: 700, background: followed ? colors.surfaceAlt : colors.blue, color: followed ? colors.ink : "#fff", transform: `scale(${press})` }}>
          {followed ? "Following ✓" : "Follow"}
        </div>
      </div>
      <div style={{ marginTop: 22, padding: "28px 32px", borderRadius: 28, background: "#fff", border: `2px solid ${colors.border}` }}>
        <div style={{ fontFamily: fonts.display, fontSize: 28, fontWeight: 700, color: colors.muted }}>Comments</div>
        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16, opacity: typed > 0 ? 1 : 0.35 }}>
          <span style={{ width: 52, height: 52, borderRadius: 26, background: colors.amber, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 26 }}>A</span>
          <span style={{ padding: "8px 18px", borderRadius: 12, background: colors.ink, color: colors.lime, fontFamily: fonts.mono, fontWeight: 700, fontSize: 36 }}>
            {word.slice(0, typed) || " "}
            {typed < word.length && t >= commentAt ? "|" : ""}
          </span>
        </div>
        <div style={{ marginTop: 14, marginLeft: 68, fontSize: 28, color: colors.muted, opacity: reply, transform: `translateY(${(1 - reply) * 16}px)` }}>
          <b style={{ color: colors.ink }}>{handle}</b> Sent! DM check karo 📩
        </div>
      </div>
    </div>
  );
}
