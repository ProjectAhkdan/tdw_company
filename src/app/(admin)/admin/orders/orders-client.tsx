"use client"

import { useState, useMemo } from "react"
import type { AdminOrder } from "@/infrastructure/storage/supabase-queries"

const GOLD = "oklch(0.78 0.16 55)"

const FALLBACK: AdminOrder[] = [
  { id: "f1", midtrans_order_id: "TDW-00123", total_amount: 2500000, status: "PAID", created_at: "2026-05-16T10:00:00Z", user: { email: "budi@example.com", profiles: [{ full_name: "Budi Santoso" }] }, order_items: [{ quantity: 1, seminar_title: "Property Revolution" }], payments: [{ method: "BANK_TRANSFER" }] },
  { id: "f2", midtrans_order_id: "TDW-00122", total_amount: 3500000, status: "PAID", created_at: "2026-05-15T09:00:00Z", user: { email: "sari@example.com", profiles: [{ full_name: "Sari Dewi" }] }, order_items: [{ quantity: 1, seminar_title: "Sales Mastery" }], payments: [{ method: "QRIS" }] },
  { id: "f3", midtrans_order_id: "TDW-00121", total_amount: 3000000, status: "PENDING", created_at: "2026-05-15T08:00:00Z", user: { email: "rudi@example.com", profiles: [{ full_name: "Rudi Hartono" }] }, order_items: [{ quantity: 1, seminar_title: "Business Breakthrough" }], payments: [{ method: "GOPAY" }] },
  { id: "f4", midtrans_order_id: "TDW-00120", total_amount: 2000000, status: "PAID", created_at: "2026-05-14T11:00:00Z", user: { email: "maya@example.com", profiles: [{ full_name: "Maya Sari" }] }, order_items: [{ quantity: 1, seminar_title: "Life Revolution" }], payments: [{ method: "BANK_TRANSFER" }] },
  { id: "f5", midtrans_order_id: "TDW-00119", total_amount: 10000000, status: "PAID", created_at: "2026-05-14T07:00:00Z", user: { email: "agus@example.com", profiles: [{ full_name: "Agus Setiawan" }] }, order_items: [{ quantity: 4, seminar_title: "Property Revolution" }], payments: [{ method: "CREDIT_CARD" }] },
  { id: "f6", midtrans_order_id: "TDW-00118", total_amount: 1800000, status: "CANCELLED", created_at: "2026-05-13T14:00:00Z", user: { email: "dewi@example.com", profiles: [{ full_name: "Dewi Lestari" }] }, order_items: [{ quantity: 1, seminar_title: "Sales Mastery" }], payments: [{ method: "BANK_TRANSFER" }] },
]

const statusStyle: Record<string, string> = {
  PAID: "bg-emerald-500/15 text-emerald-400",
  PENDING: "bg-orange-500/15 text-orange-400",
  CANCELLED: "bg-red-500/15 text-red-400",
  CONFIRMED: "bg-blue-500/15 text-blue-400",
  REFUNDED: "bg-purple-500/15 text-purple-400",
}

export default function AdminOrdersClient({ orders }: { orders: AdminOrder[] }) {
  const data = orders.length ? orders : FALLBACK
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  const filtered = useMemo(() => data.filter((o) => {
    const name = o.user?.profiles?.[0]?.full_name ?? ""
    const matchSearch = !search ||
      (o.midtrans_order_id ?? "").toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter
    return matchSearch && matchStatus
  }), [data, search, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Pesanan</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data.length} total pesanan</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          placeholder="Cari order ID, nama, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 rounded-xl border px-4 text-sm outline-none focus:ring-1"
          style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)", minWidth: 240 }}
        />
        <div className="flex gap-1 rounded-xl border p-1"
          style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
          {["ALL", "PAID", "PENDING", "CANCELLED"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="rounded-lg px-3 py-1 text-xs font-medium transition-all"
              style={statusFilter === s ? { background: GOLD, color: "oklch(0.08 0 0)" } : { color: "oklch(0.55 0.01 60)" }}>
              {s === "ALL" ? "Semua" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground"
                style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
                {["Order ID", "Pengguna", "Seminar", "Jumlah", "Metode", "Tanggal", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Tidak ada data</td></tr>
              ) : filtered.map((o) => {
                const name = o.user?.profiles?.[0]?.full_name ?? "—"
                const seminar = o.order_items?.[0]?.seminar_title ?? "—"
                const method = o.payments?.[0]?.method?.replace(/_/g, " ") ?? "—"
                const orderId = o.midtrans_order_id ?? o.id.slice(0, 8).toUpperCase()
                const date = new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                return (
                  <tr key={o.id} className="border-b transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">#{orderId}</td>
                    <td className="px-5 py-3">
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{o.user?.email}</p>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{seminar}</td>
                    <td className="px-5 py-3 font-semibold" style={{ color: GOLD }}>
                      Rp {o.total_amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{method}</td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{date}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[o.status] ?? "bg-muted text-muted-foreground"}`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
