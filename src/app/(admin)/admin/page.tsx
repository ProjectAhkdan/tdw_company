export const dynamic = 'force-dynamic'

import Link from "next/link"
import {
  TrendingUp, Users, CalendarDays, Wallet, ArrowUpRight,
} from "lucide-react"
import { getAdminStats, getAdminOrders } from "@/infrastructure/storage/supabase-queries"
import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import { AdminAlerts, AdminQuickActions } from "./admin-widgets"
import type { AlertItem, QuickActionItem } from "./admin-widgets"

const ORANGE    = "oklch(0.72 0.18 55)"
const ORANGE_BG = "oklch(0.97 0.04 60)"

const statusMap: Record<string, { cls: string; label: string }> = {
  PAID:      { cls: "dz-badge dz-badge-green",  label: "Lunas"      },
  PENDING:   { cls: "dz-badge dz-badge-orange", label: "Pending"    },
  CONFIRMED: { cls: "dz-badge dz-badge-blue",   label: "Verifikasi" },
  CANCELLED: { cls: "dz-badge dz-badge-red",    label: "Batal"      },
  REFUNDED:  { cls: "dz-badge dz-badge-purple", label: "Refund"     },
}

const kpiConfig = [
  { icon: TrendingUp,  color: ORANGE,    bg: ORANGE_BG, featured: true  },
  { icon: Users,       color: "#3B82F6", bg: "#EFF6FF", featured: false },
  { icon: CalendarDays,color: "#10B981", bg: "#ECFDF5", featured: false },
  { icon: Wallet,      color: "#8B5CF6", bg: "#F5F3FF", featured: false },
]

export default async function AdminPage() {
  const [stats, ordersRes, pendingPayments] = await Promise.all([
    getAdminStats().catch(() => null),
    getAdminOrders(8).catch(() => ({ data: null })),
    supabaseAdmin.from("orders").select("id", { count: "exact", head: true }).eq("status", "CONFIRMED"),
  ])

  const kpis = stats ?? [
    { label: "Total Pendapatan",  value: "—", sub: "0 transaksi" },
    { label: "Total Pengguna",    value: "—", sub: "terdaftar"   },
    { label: "Jadwal Aktif",      value: "—", sub: "mendatang"   },
  ]
  const orders          = ordersRes.data ?? []
  const pendingPayCount = (pendingPayments as any).count ?? 0
  const pendingWdCount  = 0

  /* Serialisable data untuk client widgets — tidak ada fungsi / icons */
  const alerts: AlertItem[] = [
    ...(pendingPayCount > 0 ? [{
      href: "/admin/orders/payments",
      iconName: "Clock" as const,
      badgeClass: "dz-badge dz-badge-orange",
      badgeText: `${pendingPayCount} menunggu`,
      text: "Pembayaran perlu diverifikasi",
    }] : []),
  ]

  const quickActions: QuickActionItem[] = [
    { href: "/admin/seminars",         label: "Buat Seminar",     desc: "Tambah seminar baru",          iconName: "CalendarDays" },
    { href: "/admin/orders/payments",  label: "Verifikasi Bayar", desc: `${pendingPayCount} menunggu`,  iconName: "Clock"        },
    { href: "/admin/blog",             label: "Tulis Artikel",    desc: "Buat konten blog",             iconName: "ArrowRight"   },
    { href: "/admin/reports",          label: "Lihat Laporan",    desc: "Analisis pendapatan",          iconName: "TrendingUp"   },
  ]

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page heading */}
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Overview</h1>
        <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>
          Ringkasan performa TDW Resources
        </p>
      </div>

      {/* Alerts (client component — has hover) */}
      <AdminAlerts alerts={alerts} />

      {/* KPI Cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {kpis.map((k, i) => {
          const cfg  = kpiConfig[i]
          const Icon = cfg.icon
          return (
            <div key={k.label}
              style={{
                background: cfg.featured ? ORANGE : "#fff",
                border: "1px solid",
                borderColor: cfg.featured ? "transparent" : "#E5E7EB",
                borderRadius: 16,
                padding: 24,
                boxShadow: cfg.featured
                  ? "0 8px 24px rgba(230,160,60,0.28)"
                  : "0 1px 3px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: cfg.featured ? "rgba(255,255,255,0.2)" : cfg.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon style={{ width: 18, height: 18, color: cfg.featured ? "#fff" : cfg.color }} />
                </div>
                <ArrowUpRight style={{
                  width: 16, height: 16,
                  color: cfg.featured ? "rgba(255,255,255,0.6)" : "#D1D5DB",
                }} />
              </div>
              <p style={{
                fontSize: "1.75rem", fontWeight: 800, margin: 0,
                color: cfg.featured ? "#fff" : "#111827", lineHeight: 1,
              }}>
                {k.value}
              </p>
              <p style={{
                fontSize: "0.8rem", marginTop: 6,
                color: cfg.featured ? "rgba(255,255,255,0.75)" : "#6B7280",
              }}>
                {k.label}
              </p>
              {k.sub && (
                <p style={{
                  fontSize: "0.7rem", marginTop: 2,
                  color: cfg.featured ? "rgba(255,255,255,0.55)" : "#9CA3AF",
                }}>
                  {k.sub}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Actions (client component — has hover) */}
      <AdminQuickActions actions={quickActions} />

      {/* Recent Orders */}
      <div style={{
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
        overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#111827", margin: 0 }}>Pesanan Terbaru</h2>
          <Link href="/admin/orders"
            style={{ fontSize: "0.8rem", fontWeight: 600, color: ORANGE, textDecoration: "none" }}>
            Lihat semua →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "#9CA3AF", fontSize: "0.875rem" }}>
            Belum ada pesanan
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="dz-table">
              <thead>
                <tr>
                  {["Order ID", "Pengguna", "Seminar", "Jumlah", "Status"].map(h => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const name    = o.user?.profiles?.[0]?.full_name ?? o.user?.email ?? "—"
                  const seminar = o.order_items?.[0]?.seminar_title ?? "—"
                  const orderId = o.id.slice(0, 8).toUpperCase()
                  const st      = statusMap[o.status] ?? { cls: "dz-badge dz-badge-gray", label: o.status }
                  return (
                    <tr key={o.id}>
                      <td>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#9CA3AF" }}>
                          #{orderId}
                        </span>
                      </td>
                      <td>
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
                            <p style={{ fontSize: "0.75rem", color: "#9CA3AF", margin: 0 }}>{o.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: "#6B7280" }}>{seminar}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: ORANGE }}>
                          Rp {o.total_amount.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td>
                        <span className={st.cls}>{st.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
