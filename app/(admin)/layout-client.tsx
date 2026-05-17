"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, CalendarDays, ShoppingCart, Users, Share2, BarChart3, LogOut, CreditCard, FileText } from "lucide-react"
import { createSupabaseBrowser } from "@/lib/auth/client"

const GOLD = "oklch(0.78 0.16 55)"

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/seminars", label: "Seminar", icon: CalendarDays },
  { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
  { href: "/admin/orders/payments", label: "Verifikasi Bayar", icon: CreditCard },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/affiliates", label: "Afiliasi", icon: Share2 },
  { href: "/admin/reports", label: "Laporan", icon: BarChart3 },
  { href: "/admin/blog", label: "Blog", icon: FileText },
]

export default function AdminLayoutClient({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const initial = userName.charAt(0).toUpperCase()

  async function handleLogout() {
    const supabase = createSupabaseBrowser()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r md:flex"
        style={{ background: "oklch(0.09 0.006 55)", borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
        <div className="flex items-center gap-2.5 border-b px-5 py-5" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold" style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>TDW</div>
          <div>
            <p className="text-sm font-semibold">TDW Resources</p>
            <p className="text-xs" style={{ color: GOLD }}>Admin Panel</p>
          </div>
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150"
                style={active ? { background: `${GOLD}15`, color: GOLD } : { color: "oklch(0.55 0.01 60)" }}>
                <item.icon className="size-4" />{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="border-t p-3" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
          <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors" style={{ color: "oklch(0.50 0.01 60)" }}>
            <LogOut className="size-4" /> Keluar
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-1 overflow-x-auto border-b px-3 py-2 md:hidden"
          style={{ background: "oklch(0.09 0.006 55)", borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href}
                className="flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                style={active ? { background: `${GOLD}15`, color: GOLD } : { color: "oklch(0.55 0.01 60)" }}>
                <item.icon className="size-3.5" />{item.label}
              </Link>
            )
          })}
        </div>
        <header className="flex h-14 items-center justify-between border-b px-6"
          style={{ background: "oklch(0.09 0.006 55 / 0.8)", borderColor: "oklch(0.18 0.01 55 / 0.5)", backdropFilter: "blur(12px)" }}>
          <p className="text-sm text-muted-foreground">{navItems.find(n => n.href === pathname)?.label ?? "Admin"}</p>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ background: `${GOLD}20`, color: GOLD }}>{initial}</div>
            <span className="text-sm font-medium">{userName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
