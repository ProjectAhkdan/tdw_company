import { CheckCircle, Clock } from "lucide-react"
import { PaymentCard } from "./payment-card"

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_BG   = "oklch(0.97 0.04 60)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

export default function AdminPaymentsContent({ orders }: { orders: any[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>
            Verifikasi Pembayaran
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>
            {orders.length} pesanan menunggu verifikasi
          </p>
        </div>
        {orders.length > 0 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: ORANGE_BG, border: `1px solid ${ORANGE}30`,
            borderRadius: 12, padding: "10px 16px",
          }}>
            <Clock style={{ width: 16, height: 16, color: ORANGE }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: ORANGE_TEXT }}>
                {orders.length} menunggu
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#6B7280" }}>
                Total: Rp {orders.reduce((s, o) => s + (o.unique_amount ?? 0), 0).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        )}
      </div>

      {orders.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
          padding: "80px 24px", textAlign: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <CheckCircle style={{ width: 48, height: 48, color: "#10B981", margin: "0 auto 12px" }} />
          <p style={{ fontSize: "1rem", fontWeight: 600, color: "#111827", margin: 0 }}>Semua bersih! 🎉</p>
          <p style={{ fontSize: "0.875rem", color: "#9CA3AF", marginTop: 6 }}>
            Tidak ada pembayaran yang perlu diverifikasi saat ini
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o: any) => (
            <PaymentCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  )
}
