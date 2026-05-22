"use client"

import { Download } from "lucide-react"

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

type Order = {
  id: string
  total_amount: number
  created_at: string
  payments: { method: string | null }[]
  order_items: { ticket: { schedule: { seminar: { category: { name: string } | null } } } }[]
}

export function ReportsExportBtn({ filtered, dateFrom, dateTo }: { filtered: Order[]; dateFrom: string; dateTo: string }) {
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
    const csv  = rows.map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a"); a.href = url; a.download = `laporan-${dateFrom}-${dateTo}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button onClick={exportCSV}
      style={{ display: "flex", alignItems: "center", gap: 8, height: 40, borderRadius: 999, padding: "0 18px", background: "#fff", border: "1.5px solid #E5E7EB", color: "#6B7280", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", transition: "border-color 0.15s, color 0.15s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = ORANGE; (e.currentTarget as HTMLElement).style.color = ORANGE_TEXT }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#E5E7EB"; (e.currentTarget as HTMLElement).style.color = "#6B7280" }}>
      <Download style={{ width: 16, height: 16 }} />
      Export CSV
    </button>
  )
}
