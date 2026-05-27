export const dynamic = 'force-dynamic'

import Link from "next/link"
import {
  TrendingUp, Users, CalendarDays, Wallet, ArrowUpRight,
} from "lucide-react"
import { getAdminStats, getAdminOrders } from "@/infrastructure/storage/supabase-queries"
import { supabaseAdmin } from "@/infrastructure/storage/db-client"
import { AdminAlerts, AdminQuickActions } from "./admin-widgets"
import type { AlertItem, QuickActionItem } from "./admin-widgets"

const LIME = "#D9F25D"
const BORDER = "oklch(0.22 0.01 255 / 0.35)"

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  PAID:      { bg: "rgba(52,211,153,0.12)",  color: "#34D399", label: "Lunas"      },
  PENDING:   { bg: "rgba(251,146,60,0.12)",  color: "#FB923C", label: "Pending"    },
  CONFIRMED: { bg: "rgba(96,165,250,0.12)",  color: "#60A5FA", label: "Verifikasi" },
  CANCELLED: { bg: "rgba(248,113,113,0.12)", color: "#F87171", label: "Batal"      },
  REFUNDED:  { bg: "rgba(167,139,250,0.12)", color: "#A78BFA", label: "Refund"     },
}

const kpiConfig = [
  {
    gradient: "linear-gradient(135deg, #D9F25D 0%, #B8D94A 50%, #9DC93D 100%)",
    shadow: "0 8px 32px rgba(217,242,93,0.35), 0 2px 8px rgba(217,242,93,0.15)",
    iconBg: "rgba(255,255,255,0.2)", iconColor: "#0A0A0A", textColor: "#0A0A0A",
    icon: TrendingUp, featured: true,
  },
  {
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(29,78,216,0.08) 100%)",
    border: "rgba(59,130,246,0.2)", iconBg: "rgba(59,130,246,0.15)", iconColor: "#60A5FA",
    icon: Users, featured: false,
  },
  {
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(5,150,105,0.06) 100%)",
    border: "rgba(16,185,129,0.18)", iconBg: "rgba(16,185,129,0.15)", iconColor: "#34D399",
    icon: CalendarDays, featured: false,
  },
  {
    gradient: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.06) 100%)",
    border: "rgba(139,92,246,0.18)", iconBg: "rgba(139,92,246,0.15)", iconColor: "#A78BFA",
    icon: Wallet, featured: false,
  },
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
    { label: "Pesanan Bulan Ini", value: "—", sub: "transaksi"   },
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
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "oklch(0.96 0.005 60)", margin: 0, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>Overview</h1>
        <p style={{ fontSize: "0.875rem", color: "oklch(0.55 0.01 60)", marginTop: 4 }}>
          Ringkasan performa TDW Resources
        </p>
      </div>

      {/* Alerts (client component — has hover) */}
      <AdminAlerts alerts={alerts} />

      {/* KPI Cards */}
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {kpis.map((k, i) => {
          const cfg = kpiConfig[i]
          const Icon = cfg.icon
          return (
            <div key={k.label}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = cfg.featured ? "0 16px 48px rgba(217,242,93,0.4)" : "0 12px 40px rgba(0,0,0,0.3)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = cfg.featured ? (cfg.shadow ?? "") : "none" }}
              style={{
                background: cfg.gradient,
                border: cfg.featured ? "none" : `1px solid ${cfg.border}`,
                borderRadius: 20, padding: 24,
                boxShadow: cfg.featured ? cfg.shadow : "none",
                position: "relative", overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                cursor: "default",
              }}>
              {cfg.featured && (
                <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon style={{ width: 18, height: 18, color: cfg.iconColor }} />
                </div>
                <ArrowUpRight style={{ width: 16, height: 16, color: cfg.featured ? "rgba(0,0,0,0.4)" : "oklch(0.42 0.008 60)" }} />
              </div>
              <p style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: cfg.featured ? "#0A0A0A" : "oklch(0.96 0.005 60)", lineHeight: 1 }}>
                {k.value}
              </p>
              <p style={{ fontSize: "0.8rem", marginTop: 6, color: cfg.featured ? "rgba(0,0,0,0.6)" : "oklch(0.65 0.01 60)" }}>
                {k.label}
              </p>
              {k.sub && (
                <p style={{ fontSize: "0.7rem", marginTop: 2, color: cfg.featured ? "rgba(0,0,0,0.45)" : "oklch(0.42 0.008 60)" }}>
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
        background: "oklch(0.10 0.008 255 / 0.7)", border: `1px solid ${BORDER}`,
        borderRadius: 16, overflow: "hidden", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${BORDER}` }}>
          <h2 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "oklch(0.96 0.005 60)", margin: 0 }}>Pesanan Terbaru</h2>
          <Link href="/admin/orders" style={{ fontSize: "0.8rem", fontWeight: 600, color: LIME, textDecoration: "none" }}>
            Lihat semua →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center", color: "oklch(0.42 0.008 60)", fontSize: "0.875rem" }}>
            Belum ada pesanan
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Order ID", "Pengguna", "Seminar", "Jumlah", "Status"].map(h => (
                    <th key={h} style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "oklch(0.42 0.008 60)", padding: "12px 16px", background: "oklch(0.12 0.009 255 / 0.5)", borderBottom: `1px solid ${BORDER}`, whiteSpace: "nowrap", textAlign: "left" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map(o => {
                  const name    = o.user?.profiles?.[0]?.full_name ?? o.user?.email ?? "—"
                  const seminar = o.order_items?.[0]?.seminar_title ?? "—"
                  const orderId = o.id.slice(0, 8).toUpperCase()
                  const st      = statusConfig[o.status] ?? { bg: "rgba(100,100,100,0.12)", color: "oklch(0.65 0.01 60)", label: o.status }
                  return (
                    <tr key={o.id} style={{ borderBottom: `1px solid oklch(0.18 0.01 255 / 0.3)`, transition: "background 0.12s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "oklch(0.13 0.01 255 / 0.5)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                      <td style={{ padding: "14px 16px", fontSize: 13 }}>
                        <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "oklch(0.55 0.01 60)" }}>#{orderId}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(217,242,93,0.1)", color: LIME, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0 }}>
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "oklch(0.9 0.005 60)", margin: 0 }}>{name}</p>
                            <p style={{ fontSize: "0.7rem", color: "oklch(0.42 0.008 60)", margin: 0 }}>{o.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "oklch(0.65 0.01 60)" }}>{seminar}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontWeight: 700, color: LIME, fontSize: 13 }}>Rp {o.total_amount.toLocaleString("id-ID")}</span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.color}30` }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.color, flexShrink: 0 }} />
                          {st.label}
                        </span>
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





