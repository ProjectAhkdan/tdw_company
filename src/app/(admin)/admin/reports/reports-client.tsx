'use client'

import { TrendingUp, ShoppingBag, BarChart2, Tag } from "lucide-react"
import { ReportsDateFilter } from "./reports-date-filter"
import { ReportsExportBtn } from "./reports-export-btn"

const ORANGE      = "#D9F25D"
const ORANGE_BG   = "rgba(217,242,93,0.12)"
const ORANGE_TEXT = "#0A0A0A"

type Order = {
  id: string
  total_amount: number
  created_at: string
  payments: { method: string | null }[]
  order_items: { ticket: { schedule: { seminar: { category: { name: string } | null } } } }[]
  user?: { email: string }
}

const kpiConfig = [
  { key: "revenue", label: "Total Pendapatan", icon: TrendingUp,   color: ORANGE,    bg: ORANGE_BG,  featured: true  },
  { key: "orders",  label: "Total Pesanan",    icon: ShoppingBag,  color: "#3B82F6", bg: "#EFF6FF",  featured: false },
  { key: "avg",     label: "Rata-rata Order",  icon: BarChart2,    color: "#10B981", bg: "#ECFDF5",  featured: false },
  { key: "cats",    label: "Kategori Aktif",   icon: Tag,          color: "#8B5CF6", bg: "#F5F3FF",  featured: false },
]

export default function AdminReportsContent({ 
  orders: initialOrders, 
  categories,
  dateFrom,
  dateTo,
  q
}: { 
  orders: Order[]; 
  categories: { id: string; name: string }[];
  dateFrom: string;
  dateTo: string;
  q: string;
}) {
  const qLower = q.toLowerCase()
  const orders = qLower 
    ? initialOrders.filter(o => o.id.toLowerCase().includes(qLower) || o.user?.email?.toLowerCase().includes(qLower))
    : initialOrders

  const filtered = orders.filter(o => {
    const d = o.created_at.slice(0, 10)
    return d >= dateFrom && d <= dateTo
  })

  const totalRevenue = filtered.reduce((s, o) => s + o.total_amount, 0)
  const avgOrder     = filtered.length ? Math.round(totalRevenue / filtered.length) : 0

  const byCategoryMap: Record<string, number> = {}
  for (const o of filtered) {
    const cat = o.order_items?.[0]?.ticket?.schedule?.seminar?.category?.name ?? "Lainnya"
    byCategoryMap[cat] = (byCategoryMap[cat] ?? 0) + o.total_amount
  }
  const byCategory = Object.entries(byCategoryMap).sort((a, b) => b[1] - a[1])

  const byMethodMap: Record<string, number> = {}
  for (const o of filtered) {
    const method = o.payments?.[0]?.method?.replace(/_/g, " ") ?? "Lainnya"
    byMethodMap[method] = (byMethodMap[method] ?? 0) + o.total_amount
  }
  const byMethod = Object.entries(byMethodMap).sort((a, b) => b[1] - a[1])

  const maxCat    = byCategory[0]?.[1] ?? 1
  const maxMethod = byMethod[0]?.[1]   ?? 1

  const kpiValues = [
    `Rp ${totalRevenue.toLocaleString("id-ID")}`,
    String(filtered.length),
    `Rp ${avgOrder.toLocaleString("id-ID")}`,
    String(byCategory.length),
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Laporan Pendapatan</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>Data real-time dari database</p>
        </div>

        {/* Date range + export */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <ReportsDateFilter defaultFrom={dateFrom} defaultTo={dateTo} />
          <ReportsExportBtn filtered={filtered} dateFrom={dateFrom} dateTo={dateTo} />
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {kpiConfig.map((k, i) => (
          <div key={k.key} style={{
            background: k.featured ? ORANGE : "#fff",
            border: "1px solid",
            borderColor: k.featured ? "transparent" : "#E5E7EB",
            borderRadius: 16, padding: 24,
            boxShadow: k.featured ? `0 8px 24px color-mix(in oklab, ${ORANGE} 28%, transparent)` : "0 1px 3px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: k.featured ? "rgba(255,255,255,0.2)" : k.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <k.icon style={{ width: 18, height: 18, color: k.featured ? "#fff" : k.color }} />
              </div>
            </div>
            <p style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: k.featured ? "#fff" : "#111827", lineHeight: 1 }}>
              {kpiValues[i]}
            </p>
            <p style={{ fontSize: "0.8rem", marginTop: 6, color: k.featured ? "rgba(255,255,255,0.75)" : "#6B7280" }}>
              {k.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))" }}>
        {/* By Category */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: 0 }}>Revenue per Kategori</h2>
              <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 3 }}>Berdasarkan kategori seminar</p>
            </div>
          </div>
          {byCategory.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "0.875rem" }}>
              Tidak ada data untuk rentang ini
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {byCategory.map(([cat, rev], idx) => {
                const pct = (rev / maxCat) * 100
                return (
                  <div key={cat}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 24, height: 24, borderRadius: 8, background: idx === 0 ? ORANGE_BG : "#F3F4F6",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.65rem", fontWeight: 800, color: idx === 0 ? ORANGE_TEXT : "#9CA3AF",
                        }}>#{idx + 1}</span>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151" }}>{cat}</span>
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: ORANGE }}>
                        Rp {rev.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div style={{ height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`, borderRadius: 99,
                        background: idx === 0 ? ORANGE : `oklch(0.82 0.12 55)`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
                      <span style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{pct.toFixed(0)}% dari total</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* By Method */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: 0 }}>Revenue per Metode Pembayaran</h2>
            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 3 }}>Berdasarkan metode pembayaran</p>
          </div>
          {byMethod.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "0.875rem" }}>
              Tidak ada data untuk rentang ini
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {byMethod.map(([method, rev], idx) => {
                const pct = (rev / maxMethod) * 100
                return (
                  <div key={method}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 24, height: 24, borderRadius: 8,
                          background: idx === 0 ? ORANGE_BG : "#F3F4F6",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.65rem", fontWeight: 800, color: idx === 0 ? ORANGE_TEXT : "#9CA3AF",
                        }}>#{idx + 1}</span>
                        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", textTransform: "capitalize" }}>{method}</span>
                      </div>
                      <span style={{ fontSize: "0.875rem", fontWeight: 700, color: ORANGE }}>
                        Rp {rev.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div style={{ height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", width: `${pct}%`, borderRadius: 99,
                        background: idx === 0 ? ORANGE : `oklch(0.82 0.12 55)`,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3 }}>
                      <span style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{pct.toFixed(0)}% dari total</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

