import Link from "next/link"
import type { AdminOrder } from "@/infrastructure/storage/supabase-queries"
import { OrdersSearch } from "./orders-search"
import { OrdersTable } from "./orders-table"

const ORANGE      = "#D9F25D"
const ORANGE_BG   = "rgba(217,242,93,0.12)"
const ORANGE_TEXT = "#0A0A0A"

const STATUS_OPTIONS = ["ALL", "PAID", "PENDING", "CONFIRMED", "CANCELLED", "REFUNDED"]

const statusMap: Record<string, { badge: string; label: string; actionBg: string; actionText: string }> = {
  PAID:      { badge: "dz-badge dz-badge-green",  label: "Lunas",     actionBg: "#ECFDF5", actionText: "#065F46" },
  PENDING:   { badge: "dz-badge dz-badge-orange", label: "Pending",   actionBg: ORANGE_BG, actionText: ORANGE_TEXT },
  CONFIRMED: { badge: "dz-badge dz-badge-blue",   label: "Verifikasi",actionBg: "#EFF6FF", actionText: "#1D4ED8" },
  CANCELLED: { badge: "dz-badge dz-badge-red",    label: "Batal",     actionBg: "#FEF2F2", actionText: "#991B1B" },
  REFUNDED:  { badge: "dz-badge dz-badge-purple", label: "Refund",    actionBg: "#F5F3FF", actionText: "#6D28D9" },
}

export default function AdminOrdersContent({ 
  orders,
  searchQuery,
  statusFilter
}: { 
  orders: AdminOrder[];
  searchQuery: string;
  statusFilter: string;
}) {
  const filtered = orders.filter(o => {
    const name = o.user?.profiles?.[0]?.full_name ?? ""
    const matchSearch = !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const totalFiltered = filtered.reduce((s, o) => s + o.total_amount, 0)

  const statusCounts = STATUS_OPTIONS.map(s => ({
    key: s,
    label: s === "ALL" ? "Semua" : statusMap[s]?.label ?? s,
    count: s === "ALL" ? orders.length : orders.filter(o => o.status === s).length,
  }))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Pesanan</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>{orders.length} total pesanan</p>
        </div>
        {filtered.length > 0 && statusFilter !== "ALL" && (
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>Total ({filtered.length} pesanan)</p>
            <p style={{ fontWeight: 800, color: ORANGE, margin: 0, fontSize: "1.125rem" }}>Rp {totalFiltered.toLocaleString("id-ID")}</p>
          </div>
        )}
      </div>

      {/* Stats pills */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {statusCounts.filter(s => s.count > 0).map(s => {
          const isActive = statusFilter === s.key
          return (
            <Link key={s.key} href={`?${new URLSearchParams({ ...(searchQuery ? { q: searchQuery } : {}), status: s.key }).toString()}`}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                height: 36, borderRadius: 999, padding: "0 14px", textDecoration: "none",
                border: isActive ? `1.5px solid ${ORANGE}` : "1.5px solid #E5E7EB",
                background: isActive ? ORANGE_BG : "#fff",
                color: isActive ? ORANGE_TEXT : "#6B7280",
                fontSize: "0.8rem", fontWeight: isActive ? 700 : 500,
                transition: "all 0.15s",
              }}>
              {s.label}
              <span style={{
                background: isActive ? ORANGE : "#F3F4F6",
                color: isActive ? "#fff" : "#9CA3AF",
                borderRadius: 999, padding: "0 7px", fontSize: "0.7rem", fontWeight: 700, height: 18, display: "flex", alignItems: "center",
              }}>{s.count}</span>
            </Link>
          )
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <OrdersSearch />
      </div>

      <OrdersTable orders={filtered} />
    </div>
  )
}

