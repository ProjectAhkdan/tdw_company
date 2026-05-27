"use client"
"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, CalendarDays, ShoppingCart, Users,
  BarChart3, LogOut, CreditCard, FileText, Bell, Search,
  MoreHorizontal, X,
} from "lucide-react"
import { motion } from "framer-motion"
import { createSupabaseBrowser } from "@/infrastructure/session/auth-client"
import { toast } from "sonner"
import Dock, { type DockItemData } from "@/shared/ui/dock"
import { StaggeredMenu, type StaggeredMenuItem } from "@/shared/ui/staggered-menu"

const LIME = "#D9F25D"

const navGroups = [
  {
    label: "MENU",
    items: [
      { href: "/admin",                  label: "Overview",         icon: LayoutDashboard },
      { href: "/admin/seminars",         label: "Seminar",          icon: CalendarDays },
      { href: "/admin/orders",           label: "Pesanan",          icon: ShoppingCart },
      { href: "/admin/orders/payments",  label: "Verifikasi Bayar", icon: CreditCard },
    ],
  },
  {
    label: "GENERAL",
    items: [
      { href: "/admin/users",   label: "Pengguna", icon: Users },
      { href: "/admin/reports", label: "Laporan",  icon: BarChart3 },
      { href: "/admin/blog",    label: "Blog",     icon: FileText },
    ],
  },
]

const allNavItems = navGroups.flatMap(g => g.items)

export default function AdminLayoutClient({
  children,
  userName,
}: {
  children: React.ReactNode
  userName: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [moreOpen, setMoreOpen] = useState(false)
  const initial = userName.charAt(0).toUpperCase()

  const currentLabel = allNavItems.find(n => isActive(n.href))?.label ?? "Admin"

  async function handleLogout() {
    try {
      const supabase = createSupabaseBrowser()
      await supabase.auth.signOut()
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = "/login"
    }
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    if (href === "/admin/orders") return pathname === "/admin/orders"
    return pathname === href || pathname.startsWith(href + "/")
  }

  // Dock: 3 main items + More button
  const dockMainItems = allNavItems.slice(0, 3)
  const moreMenuItems: StaggeredMenuItem[] = allNavItems.slice(3).map(item => ({
    label: item.label,
    href: item.href,
    active: isActive(item.href),
  }))

  const dockItems: DockItemData[] = [
    ...dockMainItems.map(item => ({
      icon: <item.icon size={18} color={isActive(item.href) ? LIME : 'oklch(0.55 0.01 60)'} />,
      label: item.label,
      active: isActive(item.href),
      onClick: () => router.push(item.href),
    })),
    {
      icon: <MoreHorizontal size={18} color={moreOpen ? LIME : 'oklch(0.55 0.01 60)'} />,
      label: 'Lainnya',
      active: moreOpen,
      onClick: () => setMoreOpen(p => !p),
    },
  ]

  const BG = "oklch(0.07 0.005 260)"
  const SIDEBAR_BG = "linear-gradient(180deg, oklch(0.09 0.008 255) 0%, oklch(0.07 0.006 260) 100%)"
  const BORDER = "oklch(0.22 0.01 255 / 0.35)"
  const HEADER_BG = "oklch(0.09 0.007 255 / 0.9)"

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: BG, color: "oklch(0.96 0.005 60)", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Mesh background */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse at 10% 0%, rgba(217,242,93,0.05) 0%, transparent 50%),
                     radial-gradient(ellipse at 90% 100%, rgba(96,165,250,0.04) 0%, transparent 50%)`,
      }} />

      {/* ── Sidebar Desktop ─────────────────────────────────────────── */}
      <aside className="relative z-10 hidden w-[240px] shrink-0 flex-col md:flex h-screen sticky top-0"
        style={{ background: SIDEBAR_BG, borderRight: `1px solid ${BORDER}` }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-[18px]" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="shimmer-lime flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black" style={{ color: "#0A0A0A" }}>
            TDW
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "oklch(0.96 0.005 60)" }}>TDW Resources</p>
            <p className="text-[10px] font-semibold" style={{ color: LIME }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navGroups.map(group => (
            <div key={group.label}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.42 0.008 60)", padding: "20px 16px 6px" }}>
                {group.label}
              </p>
              {group.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} className={`dash-nav-item${active ? " active" : ""}`}>
                    <item.icon style={{ width: 16, height: 16, color: active ? LIME : "oklch(0.55 0.01 60)", flexShrink: 0 }} />
                    {item.label}
                    {active && <span className="ml-auto h-1.5 w-1.5 rounded-full shrink-0" style={{ background: LIME }} />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="shrink-0 p-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <button onClick={handleLogout}
            className="dash-nav-item w-full hover:!text-red-400 hover:!bg-red-500/10"
            style={{ background: "transparent", border: "none" }}>
            <LogOut style={{ width: 16, height: 16 }} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex h-[60px] shrink-0 items-center justify-between px-6 gap-4"
          style={{ background: HEADER_BG, borderBottom: `1px solid ${BORDER}`, backdropFilter: "blur(20px) saturate(180%)" }}>

          {/* Page title */}
          <h1 className="text-[15px] font-bold" style={{
            background: "linear-gradient(to right, #ffffff, rgba(255,255,255,0.7))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            {currentLabel}
          </h1>

          {/* Search + actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <form onSubmit={e => {
              e.preventDefault()
              const params = new URLSearchParams(window.location.search)
              if (searchQuery.trim()) params.set("q", searchQuery.trim()); else params.delete("q")
              router.push(`${pathname}?${params.toString()}`)
            }} className="relative hidden sm:flex items-center" style={{ minWidth: 240 }}>
              <Search style={{ position: "absolute", left: 10, width: 14, height: 14, color: "oklch(0.42 0.008 60)" }} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari (Enter)..."
                style={{
                  background: "oklch(0.13 0.01 255 / 0.6)", border: `1px solid ${BORDER}`,
                  borderRadius: 10, height: 36, padding: "0 12px 0 32px",
                  fontSize: 13, color: "oklch(0.9 0 0)", width: "100%", outline: "none",
                }}
                onFocus={e => (e.target.style.borderColor = "rgba(217,242,93,0.5)")}
                onBlur={e => (e.target.style.borderColor = BORDER)}
              />
            </form>

            {/* Bell */}
            <button onClick={() => toast.info("Tidak ada notifikasi baru.", { icon: "🔔" })}
              className="relative flex items-center justify-center rounded-xl"
              style={{ width: 36, height: 36, background: "oklch(0.13 0.01 255 / 0.6)", border: `1px solid ${BORDER}`, cursor: "pointer" }}>
              <Bell style={{ width: 15, height: 15, color: "oklch(0.65 0.01 60)" }} />
              <span style={{ position: "absolute", top: 7, right: 8, width: 7, height: 7, background: LIME, borderRadius: "50%" }} />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 ml-1">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "linear-gradient(135deg, rgba(217,242,93,0.2), rgba(217,242,93,0.08))", border: "1.5px solid rgba(217,242,93,0.3)", color: LIME }}>
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold" style={{ color: "oklch(0.9 0.005 60)" }}>{userName}</p>
                <p className="text-[10px]" style={{ color: "oklch(0.42 0.008 60)" }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 pb-[88px] md:pb-6" style={{ background: "transparent" }}>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* ── Mobile Dock ──────────────────────────────────────────────── */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center"
          style={{
            height: 70,
            background: "oklch(0.09 0.006 255 / 0.92)",
            backdropFilter: "blur(20px) saturate(180%)",
            borderTop: `1px solid ${BORDER}`,
          }}>
          <Dock items={dockItems} baseItemSize={44} magnification={56} distance={100} panelHeight={56} />
        </div>

        {/* StaggeredMenu for overflow items */}
        {moreOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMoreOpen(false)} />
            <div className="fixed bottom-[78px] right-4 z-50 rounded-2xl overflow-hidden shadow-2xl"
              style={{ background: "oklch(0.11 0.009 255)", border: `1px solid ${BORDER}`, minWidth: 200 }}>
              {moreMenuItems.map(item => (
                <Link key={item.href} href={item.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
                  style={{ color: item.active ? LIME : "oklch(0.75 0.01 60)", borderBottom: `1px solid ${BORDER}` }}>
                  {item.label}
                  {item.active && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: LIME }} />}
                </Link>
              ))}
              <button onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-red-500/10"
                style={{ color: "#F87171" }}>
                <LogOut size={14} /> Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
