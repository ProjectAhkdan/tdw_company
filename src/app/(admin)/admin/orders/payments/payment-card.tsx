"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle, ExternalLink } from "lucide-react"
import { verifyPayment } from "@features/checkout/api/checkout.actions"

import { type AdminOrder } from "@/infrastructure/storage/supabase-queries"

const ORANGE      = "#D9F25D"
const ORANGE_BG   = "rgba(217,242,93,0.12)"
const ORANGE_TEXT = "#0A0A0A"

export function PaymentCard({ order }: { order: AdminOrder }) {
  const [pending, startTransition] = useTransition()

  function handle(orderId: string, approve: boolean) {
    startTransition(async () => {
      const r = await verifyPayment(orderId, approve)
      if (r && "error" in r) toast.error(r.error)
      else toast.success(approve ? "Pembayaran dikonfirmasi ✅" : "Pembayaran ditolak")
    })
  }

  const name     = order.user?.profiles?.[0]?.full_name ?? order.user?.email ?? "—"
  const item     = order.order_items?.[0]
  const sched    = item?.ticket?.schedule
  const seminar  = sched?.seminar
  const initials = name.charAt(0).toUpperCase()
  const uploadedAt = new Date(order.updated_at).toLocaleString("id-ID", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
  })

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    }}>
      {/* Status bar top */}
      <div style={{
        height: 4,
        background: `linear-gradient(90deg, ${ORANGE}, oklch(0.85 0.18 55))`,
      }} />

      <div style={{ padding: 20 }}>
        {/* Order info row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>

          {/* Left: user info */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: ORANGE_BG, color: ORANGE,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", fontWeight: 800,
            }}>
              {initials}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}>{name}</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#9CA3AF" }}>{order.user?.email}</p>
              {seminar && (
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#6B7280" }}>
                  {seminar.title} · {item?.ticket?.name} × {item?.quantity}
                </p>
              )}
              {sched && (
                <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#9CA3AF" }}>
                  📅 {new Date(sched.start_date).toLocaleDateString("id-ID")} · 📍 {sched.city}
                </p>
              )}
            </div>
          </div>

          {/* Right: amount */}
          <div style={{
            background: ORANGE_BG,
            border: `1px solid ${ORANGE}25`,
            borderRadius: 12,
            padding: "12px 16px",
            textAlign: "right",
            minWidth: 160,
          }}>
            <p style={{ margin: 0, fontSize: "0.7rem", color: "#6B7280" }}>Nominal Transfer</p>
            <p style={{ margin: "4px 0 0", fontSize: "1.375rem", fontWeight: 800, color: ORANGE, lineHeight: 1 }}>
              Rp {order.unique_amount?.toLocaleString("id-ID")}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#9CA3AF" }}>
              base: Rp {order.total_amount?.toLocaleString("id-ID")}
            </p>
            {order.bank && (
              <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${ORANGE}20` }}>
                <p style={{ margin: 0, fontSize: "0.7rem", color: ORANGE_TEXT, fontWeight: 600 }}>
                  → {order.bank.bank_name}
                </p>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "#9CA3AF" }}>
                  {order.bank.account_no}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ margin: "16px 0", height: 1, background: "#F3F4F6" }} />

        {/* Proof + actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {order.proof_url ? (
              <a href={order.proof_url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  height: 36, borderRadius: 999, padding: "0 14px",
                  background: ORANGE_BG, color: ORANGE_TEXT,
                  fontWeight: 600, fontSize: "0.8rem", textDecoration: "none",
                  border: `1px solid ${ORANGE}30`,
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.8"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              >
                <ExternalLink style={{ width: 14, height: 14 }} />
                Lihat Bukti Transfer
              </a>
            ) : (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                height: 36, borderRadius: 999, padding: "0 14px",
                background: "#FEF2F2", color: "#991B1B",
                fontSize: "0.8rem", fontWeight: 600,
              }}>
                ⚠ Belum ada bukti
              </span>
            )}
            <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
              Upload: {uploadedAt}
            </span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => handle(order.id, false)} disabled={pending}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 40, borderRadius: 999, padding: "0 18px",
                background: "#FEF2F2", color: "#991B1B", border: "none",
                fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
                opacity: pending ? 0.4 : 1, transition: "opacity 0.15s",
              }}>
              <XCircle style={{ width: 16, height: 16 }} />
              Tolak
            </button>
            <button onClick={() => handle(order.id, true)} disabled={pending}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 40, borderRadius: 999, padding: "0 20px",
                background: ORANGE, color: "#0A0A0A", border: "none",
                fontSize: "0.875rem", fontWeight: 700, cursor: "pointer",
                opacity: pending ? 0.4 : 1, transition: "opacity 0.15s, transform 0.1s",
              }}
              onMouseEnter={e => { if (!pending) (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)" }}
            >
              <CheckCircle style={{ width: 16, height: 16 }} />
              Konfirmasi Lunas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



