"use client"

import { useMemo, useState } from "react"
import { Download } from "lucide-react"

const GOLD = "oklch(0.78 0.16 55)"

type Order = {
  id: string
  total_amount: number
  created_at: string
  payments: { method: string | null }[]
  order_items: { ticket: { schedule: { seminar: { category: { name: string } | null } } } }[]
}

export default function AdminReportsClient({ orders, categories }: { orders: Order[]; categories: { id: string; name: string }[] }) {
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date(); d.setDate(1); return d.toISOString().slice(0, 10)
  })
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().slice(0, 10))

  const filtered = useMemo(() => orders.filter(o => {
    const d = o.created_at.slice(0, 10)
    return d >= dateFrom && d <= dateTo
  }), [orders, dateFrom, dateTo])

  const totalRevenue = filtered.reduce((s, o) => s + o.total_amount, 0)
  const avgOrder = filtered.length ? Math.round(totalRevenue / filtered.length) : 0

  // Revenue by category
  const byCategory = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of filtered) {
      const cat = o.order_items?.[0]?.ticket?.schedule?.seminar?.category?.name ?? "Lainnya"
      map[cat] = (map[cat] ?? 0) + o.total_amount
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filtered])

  // Revenue by payment method
  const byMethod = useMemo(() => {
    const map: Record<string, number> = {}
    for (const o of filtered) {
      const method = o.payments?.[0]?.method?.replace(/_/g, " ") ?? "Lainnya"
      map[method] = (map[method] ?? 0) + o.total_amount
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [filtered])

  const maxCat = byCategory[0]?.[1] ?? 1
  const maxMethod = byMethod[0]?.[1] ?? 1

  function exportCSV() {
    const rows = [
      ["Order ID", "Tanggal", "Jumlah", "Metode", "Kategori"],
      ...filtered.map(o => [
        o.id.slice(0, 8).toUpperCase(),
        o.created_at.slice(0, 10),
        o.total_amount,
        o.payments?.[0]?.method ?? "—",
        o.order_items?.[0]?.ticket?.schedule?.seminar?.category?.name ?? "—",
      ]),
    ]
    const csv = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a"); a.href = url; a.download = `laporan-${dateFrom}-${dateTo}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const kpis = [
    { label: "Total Pendapatan", value: `Rp ${totalRevenue.toLocaleString("id-ID")}` },
    { label: "Total Pesanan", value: String(filtered.length) },
    { label: "Rata-rata Order", value: `Rp ${avgOrder.toLocaleString("id-ID")}` },
    { label: "Kategori Aktif", value: String(byCategory.length) },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Laporan Pendapatan</h1>
          <p className="mt-1 text-sm text-muted-foreground">Data real-time dari database</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="h-9 rounded-xl border px-3 text-sm outline-none"
            style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
          <span className="text-muted-foreground">—</span>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="h-9 rounded-xl border px-3 text-sm outline-none"
            style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
          <button onClick={exportCSV}
            className="flex h-9 items-center gap-2 rounded-xl border px-4 text-sm transition-colors hover:bg-white/5"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.65 0 0)" }}>
            <Download className="size-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(k => (
          <div key={k.label} className="glass rounded-2xl p-5">
            <p className="text-2xl font-bold" style={{ color: GOLD }}>{k.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* By Category */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-5 font-semibold">Revenue per Kategori</h2>
          {byCategory.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada data</p>
          ) : (
            <div className="space-y-4">
              {byCategory.map(([cat, rev]) => (
                <div key={cat}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{cat}</span>
                    <span className="font-medium" style={{ color: GOLD }}>Rp {rev.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: "oklch(0.18 0.01 55)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(rev / maxCat) * 100}%`, background: GOLD }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* By Method */}
        <div className="glass rounded-2xl p-6">
          <h2 className="mb-5 font-semibold">Revenue per Metode Pembayaran</h2>
          {byMethod.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada data</p>
          ) : (
            <div className="space-y-4">
              {byMethod.map(([method, rev]) => (
                <div key={method}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span>{method}</span>
                    <span className="font-medium" style={{ color: GOLD }}>Rp {rev.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full" style={{ background: "oklch(0.18 0.01 55)" }}>
                    <div className="h-full rounded-full" style={{ width: `${(rev / maxMethod) * 100}%`, background: GOLD }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
