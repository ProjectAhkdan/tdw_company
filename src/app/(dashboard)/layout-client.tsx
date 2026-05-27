"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Home, Ticket, User, LogOut, CalendarDays, BookOpen, Bell, MoreHorizontal } from "lucide-react"
import { motion } from "framer-motion"
import { createSupabaseBrowser } from "@/infrastructure/session/auth-client"
import Dock, { type DockItemData } from "@/shared/ui/dock"

const LIME = "#D9F25D"
const BORDER = "oklch(0.22 0.01 255 / 0.35)"
const BG = "oklch(0.07 0.005 260)"
const SIDEBAR_BG = "linear-gradient(180deg, oklch(0.09 0.008 255) 0%, oklch(0.07 0.006 260) 100%)"

const navItems = [
  { href: "/dashboard",         label: "Dashboard",  icon: Home },
  { href: "/dashboard/tickets", label: "Tiket Saya", icon: Ticket },
  { href: "/dashboard/profile", label: "Profil",     icon: User },
]

const publicLinks = [
  { href: "/seminars", label: "Seminar",  icon: CalendarDays },
  { href: "/blog",     label: "Blog",     icon: BookOpen },
]

function Avatar({ url, initial, size = 36 }: { url: string | null; initial: string; size?: number }) {
  if (url) return (
    <Image src={url} alt="avatar" width={size} height={size}
      className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />
  )
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size, height: size,
        background: "linear-gradient(135deg, rgba(217,242,93,0.2), rgba(217,242,93,0.08))",
        border: "1.5px solid rgba(217,242,93,0.3)",
        color: LIME, fontSize: size < 32 ? 11 : 14,
      }}>
      {initial}
    </div>
  )
}

export default function DashboardLayoutClient({ children, userName, avatarUrl }: {
  children: React.ReactNode
  userName: string
  avatarUrl: string | null
}) {
  const pathname = usePathname()
  const router = useRouter()
  const initial = userName.charAt(0).toUpperCase()
  const currentLabel = [...navItems, ...publicLinks].find(n => n.href === pathname)?.label ?? "Dashboard"

  async function handleLogout() {
    try {
      const supabase = createSupabaseBrowser()
      await supabase.auth.signOut()
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      window.location.href = "/login"
    }
  }

  // Dock: 3 main nav items
  const dockItems: DockItemData[] = navItems.map(item => ({
    icon: <item.icon size={18} color={pathname === item.href ? LIME : 'oklch(0.55 0.01 60)'} />,
    label: item.label,
    active: pathname === item.href,
    onClick: () => router.push(item.href),
  }))

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
          <Link href="/" className="flex items-center gap-3">
            <div className="shimmer-lime flex h-9 w-9 items-center justify-center rounded-xl text-xs font-black" style={{ color: "#0A0A0A" }}>
              TDW
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: "oklch(0.96 0.005 60)" }}>TDW Resources</p>
              <p className="text-[10px] font-semibold" style={{ color: LIME }}>Member Area</p>
            </div>
          </Link>
        </div>

        {/* Profile card */}
        <div className="mx-3 mt-3 rounded-2xl p-4" style={{
          background: "oklch(0.12 0.01 255 / 0.7)",
          border: `1px solid ${BORDER}`,
          backdropFilter: "blur(12px)",
        }}>
          <Avatar url={avatarUrl} initial={initial} size={44} />
          <p className="mt-3 text-sm font-bold" style={{ color: "oklch(0.96 0.005 60)" }}>{userName}</p>
          <span style={{
            display: "inline-block", marginTop: 4, padding: "2px 10px",
            background: "rgba(217,242,93,0.1)", color: LIME,
            borderRadius: 999, fontSize: 11, fontWeight: 600,
          }}>Member</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.42 0.008 60)", padding: "16px 16px 6px" }}>
            NAVIGASI
          </p>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className={`dash-nav-item${active ? " active" : ""}`}>
                <item.icon style={{ width: 16, height: 16, color: active ? LIME : "oklch(0.55 0.01 60)", flexShrink: 0 }} />
                {item.label}
                {active && <span className="ml-auto h-1.5 w-1.5 rounded-full shrink-0" style={{ background: LIME }} />}
              </Link>
            )
          })}

          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.42 0.008 60)", padding: "16px 16px 6px" }}>
            JELAJAHI
          </p>
          {publicLinks.map(item => (
            <Link key={item.href} href={item.href} className="dash-nav-item">
              <item.icon style={{ width: 16, height: 16, color: "oklch(0.55 0.01 60)", flexShrink: 0 }} />
              {item.label}
            </Link>
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
        <header className="flex h-[60px] shrink-0 items-center justify-between px-6"
          style={{ background: "oklch(0.09 0.007 255 / 0.9)", borderBottom: `1px solid ${BORDER}`, backdropFilter: "blur(20px) saturate(180%)" }}>
          <p className="text-[15px] font-bold" style={{
            background: "linear-gradient(to right, #ffffff, rgba(255,255,255,0.7))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          }}>
            {currentLabel}
          </p>
          <div className="flex items-center gap-2.5">
            <Avatar url={avatarUrl} initial={initial} size={30} />
            <span className="hidden text-sm font-medium sm:block" style={{ color: "oklch(0.9 0.005 60)" }}>{userName}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-[88px] md:pb-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* ── Mobile Dock ──────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center md:hidden"
        style={{
          height: 70,
          background: "oklch(0.09 0.006 255 / 0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          borderTop: `1px solid ${BORDER}`,
        }}>
        <Dock items={dockItems} baseItemSize={44} magnification={56} distance={100} panelHeight={56} />
      </div>
    </div>
  )
}
