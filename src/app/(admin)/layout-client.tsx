"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, CalendarDays, ShoppingCart, Users,
  BarChart3, LogOut, CreditCard, FileText, Bell, Search, Sun, Moon
} from "lucide-react"
import { createSupabaseBrowser } from "@/infrastructure/session/auth-client"
import { toast } from "sonner"

const ORANGE = "#D9F25D"

const navGroups = [
  {
    label: "MENU",
    items: [
      { href: "/admin",                label: "Overview",        icon: LayoutDashboard },
      { href: "/admin/seminars",       label: "Seminar",         icon: CalendarDays },
      { href: "/admin/orders",         label: "Pesanan",         icon: ShoppingCart },
      { href: "/admin/orders/payments",label: "Verifikasi Bayar",icon: CreditCard },
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

export default function AdminLayoutClient({
  children,
  userName,
}: {
  children: React.ReactNode
  userName: string
}) {
  const pathname = usePathname()
  const router   = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDark, setIsDark] = useState(false)
  const initial  = userName.charAt(0).toUpperCase()

  const currentLabel =
    navGroups
      .flatMap(g => g.items)
      .find(n =>
        n.href === "/admin"
          ? pathname === "/admin"
          : pathname.startsWith(n.href)
      )?.label ?? "Admin"

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
    return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href)
  }

  return (
    /* data-admin scopes the Donezo light theme CSS variables */
    <div data-admin className="flex h-screen overflow-hidden" style={{ background: "var(--dz-bg,#F4F5F7)", color: "var(--dz-text,#111827)", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="hidden w-[220px] shrink-0 flex-col md:flex h-screen sticky top-0"
        style={{ background: "#fff", borderRight: "1px solid #E5E7EB" }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-[18px]" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black"
            style={{ background: ORANGE, color: "#0A0A0A" }}>
            TDW
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: "#111827" }}>TDW Resources</p>
            <p className="text-[10px] font-medium" style={{ color: ORANGE }}>Admin Panel</p>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4">
          {navGroups.map(group => (
            <div key={group.label}>
              <p className="dz-section-label">{group.label}</p>
              {group.items.map(item => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`dz-nav-item${active ? " active" : ""}`}
                  >
                    <item.icon
                      className="shrink-0"
                      style={{
                        width: 16, height: 16,
                        color: active ? ORANGE : "#9CA3AF",
                      }}
                    />
                    {item.label}
                    {active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full shrink-0"
                        style={{ background: ORANGE }} />
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 shrink-0" style={{ borderTop: "1px solid #F3F4F6" }}>
          <div className="mt-3" />
          <button
            onClick={handleLogout}
            className="dz-nav-item w-full hover:!bg-red-50 hover:!text-red-600"
            style={{ cursor: "pointer", background: "transparent", border: "none" }}
          >
            <LogOut style={{ width: 16, height: 16 }} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">

        {/* Mobile nav strip */}
        <div className="flex items-center gap-1 overflow-x-auto px-3 py-2 md:hidden shrink-0"
          style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
          {navGroups.flatMap(g => g.items).map(item => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors"
                style={active
                  ? { background: "rgba(217,242,93,0.12)", color: ORANGE }
                  : { color: "#6B7280" }}
              >
                <item.icon style={{ width: 13, height: 13 }} />
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Header */}
        <header
          className="flex h-[64px] shrink-0 items-center justify-between px-6 gap-4"
          style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}
        >
          {/* Page title */}
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold" style={{ color: "#111827", fontFamily: "'Inter', system-ui, sans-serif" }}>
              {currentLabel}
            </h1>
          </div>

          {/* Search + actions */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Search bar */}
            <form onSubmit={e => {
              e.preventDefault()
              if (!searchQuery.trim()) {
                router.push(pathname)
                return
              }
              // Update URL query param "q"
              const params = new URLSearchParams(window.location.search)
              params.set("q", searchQuery.trim())
              router.push(`${pathname}?${params.toString()}`)
            }} className="relative hidden sm:flex items-center"
              style={{ background: "#F4F5F7", borderRadius: 10, padding: "0 12px", height: 38, gap: 8, minWidth: 200 }}>
              <Search style={{ width: 14, height: 14, color: "#9CA3AF", flexShrink: 0 }} />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari (tekan Enter)..."
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontSize: "0.8rem", color: "#6B7280", width: "100%",
                }}
              />
            </form>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                setIsDark(!isDark)
                toast.info(isDark ? "Beralih ke Light Mode" : "Beralih ke Dark Mode (Coming Soon)")
              }}
              className="flex items-center justify-center rounded-xl"
              style={{ width: 38, height: 38, background: "#F4F5F7", border: "none", cursor: "pointer", transition: "transform 0.1s" }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isDark ? <Moon style={{ width: 16, height: 16, color: "#6B7280" }} /> : <Sun style={{ width: 16, height: 16, color: "#6B7280" }} />}
            </button>

            {/* Bell */}
            <button
              onClick={() => toast.info("Tidak ada notifikasi baru untuk saat ini.", { icon: "🔔" })}
              className="flex items-center justify-center rounded-xl relative"
              style={{ width: 38, height: 38, background: "#F4F5F7", border: "none", cursor: "pointer", transition: "transform 0.1s" }}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.95)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Bell style={{ width: 16, height: 16, color: "#6B7280" }} />
              <span style={{ position: "absolute", top: 8, right: 10, width: 6, height: 6, background: ORANGE, borderRadius: "50%" }} />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5 ml-2">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                style={{ background: "rgba(217,242,93,0.12)", color: ORANGE }}
              >
                {initial}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold" style={{ color: "#111827" }}>Admin {userName}</p>
                <p className="text-[10px]" style={{ color: "#9CA3AF" }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--dz-bg,#F4F5F7)" }}>
          {children}
        </main>
      </div>
    </div>
  )
}



