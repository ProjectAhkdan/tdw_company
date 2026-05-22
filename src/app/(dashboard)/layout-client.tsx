"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Home, Ticket, User, Share2, LogOut } from "lucide-react"
import { createSupabaseBrowser } from "@/infrastructure/session/auth-client"

const GOLD = "oklch(0.78 0.16 55)"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/dashboard/tickets", label: "Tiket Saya", icon: Ticket },
  { href: "/dashboard/profile", label: "Profil", icon: User },
]

function Avatar({ url, initial, size = 36 }: { url: string | null; initial: string; size?: number }) {
  if (url) return (
    <Image src={url} alt="avatar" width={size} height={size}
      className="rounded-full object-cover shrink-0"
      style={{ width: size, height: size }} />
  )
  return (
    <div className="flex shrink-0 items-center justify-center rounded-full text-sm font-bold"
      style={{ width: size, height: size, background: `${GOLD}20`, color: GOLD, fontSize: size < 32 ? 11 : 14 }}>
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
        <div className="border-b px-5 py-5" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold" style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>TDW</div>
            <span className="text-sm font-semibold">Resources</span>
          </Link>
        </div>
        <div className="border-b px-5 py-4" style={{ borderColor: "oklch(0.18 0.01 55 / 0.5)" }}>
          <div className="flex items-center gap-3">
            <Avatar url={avatarUrl} initial={initial} size={36} />
            <div>
              <p className="text-sm font-medium">{userName}</p>
              <p className="text-xs text-muted-foreground">Member</p>
            </div>
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
        <header className="flex h-14 items-center justify-between border-b px-6"
          style={{ background: "oklch(0.09 0.006 55 / 0.8)", borderColor: "oklch(0.18 0.01 55 / 0.5)", backdropFilter: "blur(12px)" }}>
          <p className="text-sm text-muted-foreground">{navItems.find(n => n.href === pathname)?.label ?? "Dashboard"}</p>
          <div className="flex items-center gap-2">
            <Avatar url={avatarUrl} initial={initial} size={28} />
            <span className="text-sm font-medium">{userName}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6 pb-24 md:pb-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t py-2 md:hidden"
        style={{ background: "oklch(0.09 0.006 55 / 0.95)", borderColor: "oklch(0.18 0.01 55 / 0.5)", backdropFilter: "blur(16px)" }}>
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors"
              style={{ color: active ? GOLD : "oklch(0.50 0.01 60)" }}>
              <item.icon className="size-5" />{item.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
