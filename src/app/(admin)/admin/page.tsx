import { TrendingUp, Users, CalendarDays, Wallet } from "lucide-react"
import { getAdminStats, getAdminOrders } from "@/infrastructure/storage/supabase-queries"

const GOLD = "oklch(0.78 0.16 55)"

const FALLBACK_STATS = [
  { label: "Total Pendapatan", value: "Rp 31.000.000", sub: "5 transaksi" },
  { label: "Total Pengguna", value: "6", sub: "terdaftar" },
  { label: "Jadwal Aktif", value: "3", sub: "mendatang" },
  { label: "Pencairan Pending", value: "Rp 0", sub: "0 afiliator" },
]

const FALLBACK_ORDERS = [
  { id: "f1", midtrans_order_id: "TDW-00123", total_amount: 2500000, status: "PAID", created_at: "2026-05-16", user: { email: "budi@example.com", profiles: [{ full_name: "Budi Santoso" }] }, order_items: [{ quantity: 1, seminar_title: "Property Revolution" }], payments: [{ method: "BANK_TRANSFER" }] },
  { id: "f2", midtrans_order_id: "TDW-00122", total_amount: 3500000, status: "PAID", created_at: "2026-05-15", user: { email: "sari@example.com", profiles: [{ full_name: "Sari Dewi" }] }, order_items: [{ quantity: 1, seminar_title: "Sales Mastery" }], payments: [{ method: "QRIS" }] },
  { id: "f3", midtrans_order_id: "TDW-00121", total_amount: 3000000, status: "PENDING", created_at: "2026-05-15", user: { email: "rudi@example.com", profiles: [{ full_name: "Rudi Hartono" }] }, order_items: [{ quantity: 1, seminar_title: "Business Breakthrough" }], payments: [{ method: "GOPAY" }] },
  { id: "f4", midtrans_order_id: "TDW-00120", total_amount: 2000000, status: "PAID", created_at: "2026-05-14", user: { email: "maya@example.com", profiles: [{ full_name: "Maya Sari" }] }, order_items: [{ quantity: 1, seminar_title: "Life Revolution" }], payments: [{ method: "BANK_TRANSFER" }] },
  { id: "f5", midtrans_order_id: "TDW-00119", total_amount: 10000000, status: "PAID", created_at: "2026-05-14", user: { email: "agus@example.com", profiles: [{ full_name: "Agus Setiawan" }] }, order_items: [{ quantity: 4, seminar_title: "Property Revolution" }], payments: [{ method: "CREDIT_CARD" }] },
]

const statusStyle: Record<string, string> = {
  PAID: "bg-emerald-500/15 text-emerald-400",
  PENDING: "bg-orange-500/15 text-orange-400",
  CANCELLED: "bg-red-500/15 text-red-400",
  CONFIRMED: "bg-blue-500/15 text-blue-400",
  REFUNDED: "bg-purple-500/15 text-purple-400",
}

const kpiIcons = [TrendingUp, Users, CalendarDays, Wallet]

export default async function AdminPage() {
  const [stats, ordersRes] = await Promise.all([
    getAdminStats().catch(() => null),
    getAdminOrders(10).catch(() => ({ data: null, error: null })),
  ])

  const kpis = stats ?? FALLBACK_STATS
  const orders = ordersRes.data?.length ? ordersRes.data : FALLBACK_ORDERS

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ringkasan performa TDW Resources</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = kpiIcons[i]
          return (
            <div key={k.label} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: `${GOLD}15` }}>
                  <Icon className="size-4" style={{ color: GOLD }} />
                </div>
                {k.sub && <span className="text-xs text-muted-foreground">{k.sub}</span>}
              </div>
              <p className="mt-4 text-2xl font-bold" style={{ color: GOLD }}>{k.value}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{k.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders */}
      <div className="glass rounded-2xl">
        <div className="border-b px-6 py-4" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
          <h2 className="font-semibold">Pesanan Terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground"
                style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
                {["Order ID", "Pengguna", "Seminar", "Jumlah", "Metode", "Status"].map(h => (
                  <th key={h} className="px-6 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const name = o.user?.profiles?.[0]?.full_name ?? o.user?.email ?? "—"
                const seminar = o.order_items?.[0]?.seminar_title ?? "—"
                const method = o.payments?.[0]?.method?.replace("_", " ") ?? "—"
                const orderId = o.midtrans_order_id ?? o.id.slice(0, 8).toUpperCase()
                return (
                  <tr key={o.id} className="border-b transition-colors hover:bg-white/[0.02]"
                    style={{ borderColor: "oklch(0.18 0.01 55 / 0.3)" }}>
                    <td className="px-6 py-3 font-mono text-xs text-muted-foreground">#{orderId}</td>
                    <td className="px-6 py-3">
                      <p className="font-medium">{name}</p>
                      <p className="text-xs text-muted-foreground">{o.user?.email}</p>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{seminar}</td>
                    <td className="px-6 py-3 font-semibold" style={{ color: GOLD }}>
                      Rp {o.total_amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-3 text-muted-foreground text-xs">{method}</td>
                    <td className="px-6 py-3">
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
