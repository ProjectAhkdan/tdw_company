"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { createSupabaseBrowser } from "@/infrastructure/session/auth-client"
import { StaggeredMenu } from "@/shared/ui/staggered-menu"

const navLinks = [
  { href: "/seminars", label: "Seminar" },
  { href: "/schedule", label: "Jadwal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Tentang" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getSession().then(({ data }) => setIsLoggedIn(!!data.session))
  }, [])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const menuItems = navLinks.map(l => ({ href: l.href, label: l.label, active: pathname === l.href }))

  const menuFooter = (
    <Link
      href={isLoggedIn ? "/dashboard" : "/register"}
      className="pill-lime"
      onClick={() => {}}
    >
      {isLoggedIn ? "Masuk Dashboard" : "Daftar Sekarang"}
      <span className="pill-dot" />
    </Link>
  )

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full transition-all duration-300"
        style={{
          background: "#0A0A0A",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          height: "56px",
        }}
      >
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/icons/logo.png" alt="TDW Resources" className="h-10 w-auto object-contain" />
            <span className="text-base font-semibold text-white">TDW Resources</span>
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden items-center md:flex">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-0.5 px-3 py-2 text-[13px] font-medium transition-colors"
                style={{ color: pathname === l.href ? "#D9F25D" : "#8A8A8A" }}
                onMouseEnter={e => { if (pathname !== l.href) (e.currentTarget as HTMLElement).style.color = "#FFFFFF" }}
                onMouseLeave={e => { if (pathname !== l.href) (e.currentTarget as HTMLElement).style.color = "#8A8A8A" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <button className="hidden text-white/70 hover:text-white transition-colors md:block" aria-label="Search">
              <Search className="size-5" />
            </button>
            <Link href={isLoggedIn ? "/dashboard" : "/register"} className="pill-lime pill-lime--desktop">
              {isLoggedIn ? "Masuk Dashboard" : "Daftar Sekarang"}
              <span className="pill-dot" />
            </Link>
            {/* Mobile hamburger — StaggeredMenu */}
            <StaggeredMenu items={menuItems} footer={menuFooter} />
          </div>
        </div>
      </header>
    </>
  )
}
