import { colors, fonts } from "./brand";

// Incoming-call screen for inside <Phone dark> (phone-local pixels, 420 wide).
// `name` is what the network shows (CNAP); pass the bare number as `name` for an unknown caller.
export function IncomingCall({ name, number, sub, network = "Jio 5G", ring = 0 }: { name: string; number: string; sub?: string; network?: string; ring?: number }) {
  const pulse = 1 + 0.08 * Math.sin(ring * Math.PI * 2);
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1e293b,#0f172a)", color: "#fff", fontFamily: fonts.body, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70 }}>
      <div style={{ fontSize: 22, color: "#94a3b8", fontWeight: 600 }}>Incoming call · {network}</div>
      <div style={{ width: 130, height: 130, borderRadius: 99, background: "#334155", marginTop: 30, display: "grid", placeItems: "center", fontSize: 60, fontWeight: 800, transform: `scale(${pulse})`, boxShadow: ring ? `0 0 0 ${10 + 10 * Math.abs(Math.sin(ring * Math.PI))}px rgba(148,163,184,0.18)` : "none" }}>
        {/[A-Za-z]/.test(name[0]) ? name[0] : "?"}
      </div>
      <div style={{ fontSize: 36, fontWeight: 800, marginTop: 24, textAlign: "center", padding: "0 20px", lineHeight: 1.15 }}>{name}</div>
      <div style={{ fontSize: 26, color: "#cbd5e1", marginTop: 8 }}>{number}</div>
      {sub ? <div style={{ fontSize: 20, color: "#94a3b8", marginTop: 6 }}>{sub}</div> : null}
      <div style={{ position: "absolute", bottom: 60, left: 50, right: 50, display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: 96, height: 96, borderRadius: 99, background: colors.red, display: "grid", placeItems: "center", fontSize: 44 }}>✕</div>
        <div style={{ width: 96, height: 96, borderRadius: 99, background: "#22c55e", display: "grid", placeItems: "center", fontSize: 44 }}>✆</div>
      </div>
    </div>
  );
}
