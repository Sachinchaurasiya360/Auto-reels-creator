import { colors } from "./brand";

// A bank SMS / notification card for inside <Phone> (phone-local pixels). `enter` 0-1 slides it down.
export function Sms({ y, from = "BANK", time = "now", text, color, enter = 1 }: { y: number; from?: string; time?: string; text: string; color: string; enter?: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 22,
        right: 22,
        top: y,
        borderRadius: 26,
        background: "#f5f5f4",
        padding: "18px 22px",
        borderLeft: `10px solid ${color}`,
        opacity: enter,
        transform: `translateY(${(1 - enter) * -40}px)`,
        boxShadow: "0 16px 30px -18px rgba(12,10,9,0.35)",
      }}
    >
      <div style={{ fontSize: 22, color: colors.muted, fontWeight: 600 }}>
        {from} · {time}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: colors.ink }}>{text}</div>
    </div>
  );
}
