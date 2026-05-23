"use client"

import { useState, useTransition } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"
import type { AdminOrder } from "@/infrastructure/storage/supabase-queries"
import { ConfirmDialog } from "@shared/ui/confirm-dialog"

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_BG   = "oklch(0.97 0.04 60)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

const statusMap: Record<string, { badge: string; label: string; actionBg: string; actionText: string }> = {
  PAID:      { badge: "dz-badge dz-badge-green",  label: "Lunas",     actionBg: "#ECFDF5", actionText: "#065F46" },
  PENDING:   { badge: "dz-badge dz-badge-orange", label: "Pending",   actionBg: ORANGE_BG, actionText: ORANGE_TEXT },
  CONFIRMED: { badge: "dz-badge dz-badge-blue",   label: "Verifikasi",actionBg: "#EFF6FF", actionText: "#1D4ED8" },
  CANCELLED: { badge: "dz-badge dz-badge-red",    label: "Batal",     actionBg: "#FEF2F2", actionText: "#991B1B" },
  REFUNDED:  { badge: "dz-badge dz-badge-purple", label: "Refund",    actionBg: "#F5F3FF", actionText: "#6D28D9" },
}

function OrderRow({ order, selected, onToggle, setConfirm }: {
  order: AdminOrder; selected: boolean; onToggle: () => void; setConfirm: (c: any) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [pending, startTransition] = useTransition()

  const name    = order.user?.profiles?.[0]?.full_name ?? "—"
  const seminar = order.order_items?.[0]?.seminar_title ?? "—"
  const method  = order.payments?.[0]?.method?.replace(/_/g, " ") ?? "—"
  const orderId = order.id.slice(0, 8).toUpperCase()
  const date    = new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
  const st      = statusMap[order.status] ?? { badge: "dz-badge dz-badge-gray", label: order.status, actionBg: "#F3F4F6", actionText: "#6B7280" }

  async function updateStatus(newStatus: string) {
    startTransition(async () => {
      const { updateOrderStatus } = await import("@/app/actions/checkout/action")
      const r = await (updateOrderStatus as any)(order.id, newStatus)
      if (r?.error) toast.error(r.error)
      else toast.success(`Status → ${newStatus}`)
    })
  }

  return (
    <>
      <tr style={{ borderBottom: "1px solid #F3F4F6", cursor: "pointer", transition: "background 0.1s" }}
        onClick={() => setExpanded(e => !e)}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#F8F9FA"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}>
        <td style={{ padding: "14px 16px", width: 40 }} onClick={e => e.stopPropagation()}>
          <input type="checkbox" checked={selected} onChange={onToggle} style={{ cursor: "pointer", width: 15, height: 15 }} />
        </td>
        <td style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {expanded
              ? <ChevronUp  style={{ width: 13, height: 13, color: "#9CA3AF" }} />
              : <ChevronDown style={{ width: 13, height: 13, color: "#9CA3AF" }} />}
            <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#9CA3AF" }}>#{orderId}</span>
          </div>
        </td>
        <td style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: ORANGE_BG, color: ORANGE,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.75rem", fontWeight: 700, flexShrink: 0,
            }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>{name}</p>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>{order.user?.email}</p>
            </div>
          </div>
        </td>
        <td style={{ padding: "14px 20px", fontSize: "0.875rem", color: "#6B7280", maxWidth: 200 }}>
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>{seminar}</span>
        </td>
        <td style={{ padding: "14px 20px" }}>
          <span style={{ fontWeight: 700, color: ORANGE, fontSize: "0.875rem" }}>
            Rp {order.total_amount.toLocaleString("id-ID")}
          </span>
        </td>
        <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#9CA3AF" }}>{method}</td>
        <td style={{ padding: "14px 20px", fontSize: "0.8rem", color: "#9CA3AF" }}>{date}</td>
        <td style={{ padding: "14px 20px" }}>
          <span className={st.badge}>{st.label}</span>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={8} style={{ background: "#F8F9FA", borderBottom: "1px solid #F3F4F6", padding: "16px 20px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 20 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}><span style={{ fontWeight: 600, color: "#374151" }}>Order ID:</span> {order.id}</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}><span style={{ fontWeight: 600, color: "#374151" }}>Qty:</span> {order.order_items?.[0]?.quantity ?? 1} tiket</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#6B7280" }}><span style={{ fontWeight: 600, color: "#374151" }}>Tanggal:</span> {new Date(order.created_at).toLocaleString("id-ID")}</p>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>Ubah status:</span>
                {["PAID", "PENDING", "CANCELLED", "REFUNDED"].filter(s => s !== order.status).map(s => {
                  const ms = statusMap[s]
                  return (
                    <button key={s} onClick={e => { e.stopPropagation(); updateStatus(s) }} disabled={pending}
                      style={{
                        height: 30, borderRadius: 999, padding: "0 12px",
                        fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                        background: ms?.actionBg ?? "#F3F4F6", color: ms?.actionText ?? "#6B7280",
                        border: "none", opacity: pending ? 0.5 : 1,
                      }}>
                      {ms?.label ?? s}
                    </button>
                  )
                })}
                {["PENDING", "CANCELLED"].includes(order.status) && (
                  <button onClick={e => {
                    e.stopPropagation()
                    setConfirm({
                      title: "Hapus Order",
                      message: "Hapus order ini secara permanen?",
                      onConfirm: () => startTransition(async () => {
                        const { deleteOrder } = await import("@/app/actions/checkout/action")
                        const r = await (deleteOrder as any)(order.id)
                        if (r?.error) toast.error(r.error)
                        else toast.success("Order dihapus")
                      })
                    })
                  }} disabled={pending}
                    style={{ height: 30, borderRadius: 999, padding: "0 12px", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", background: "#FEF2F2", color: "#991B1B", border: "none", opacity: pending ? 0.5 : 1 }}>
                    🗑 Hapus
                  </button>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const [selected,     setSelected]     = useState<Set<string>>(new Set())
  const [bulkPending,  setBulkPending]  = useState(false)
  const [confirm,      setConfirm]      = useState<{ title: string; message: string; onConfirm: () => void } | null>(null)

  const allSelected   = orders.length > 0 && orders.every(o => selected.has(o.id))

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else             setSelected(new Set(orders.map(o => o.id)))
  }
  function toggleOne(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n }) }

  function handleBulkDelete() {
    setConfirm({
      title: "Hapus Order Terpilih",
      message: `Hapus ${selected.size} order secara permanen?`,
      onConfirm: async () => {
        setBulkPending(true)
        const { deleteOrdersBulk } = await import("@/app/actions/checkout/action")
        const r = await (deleteOrdersBulk as any)([...selected])
        if (r?.error) toast.error(r.error)
        else { toast.success(`${selected.size} order dihapus`); setSelected(new Set()) }
        setBulkPending(false)
      }
    })
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {selected.size > 0 && (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={handleBulkDelete} disabled={bulkPending}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              height: 40, borderRadius: 999, padding: "0 16px",
              background: "#FEF2F2", color: "#991B1B", border: "none",
              fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
              opacity: bulkPending ? 0.5 : 1,
            }}>
            {bulkPending ? "Menghapus..." : `🗑 Hapus ${selected.size} terpilih`}
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E5E7EB" }}>
                <th style={{ padding: "12px 16px", textAlign: "left", width: 40, background: "#F8F9FA" }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ cursor: "pointer", width: 15, height: 15 }} />
                </th>
                {["Order ID", "Pengguna", "Seminar", "Jumlah", "Metode", "Tanggal", "Status"].map(h => (
                  <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9CA3AF", background: "#F8F9FA", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: "56px 20px", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
                    Tidak ada pesanan
                  </td>
                </tr>
              ) : orders.map(o => (
                <OrderRow key={o.id} order={o} selected={selected.has(o.id)} onToggle={() => toggleOne(o.id)} setConfirm={setConfirm} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {confirm && (
        <ConfirmDialog title={confirm.title} message={confirm.message} confirmLabel="Hapus"
          onConfirm={() => { confirm.onConfirm(); setConfirm(null) }}
          onCancel={() => setConfirm(null)} />
      )}
      <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#D1D5DB" }}>Klik baris untuk melihat detail dan mengubah status</p>
    </div>
  )
}
