"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Search, Menu, X } from "lucide-react"

import { createSupabaseBrowser } from "@/infrastructure/session/auth-client"

const navLinks = [
  { href: "/seminars", label: "Seminar", dropdown: true },
  { href: "/schedule", label: "Jadwal", dropdown: true },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Tentang" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseBrowser()
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session)
    })
  }, [])
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

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
            <Link href={isLoggedIn ? "/dashboard" : "/register"} className="hidden md:flex pill-lime">
              {isLoggedIn ? "Masuk Dashboard" : "Daftar Sekarang"}
              <span className="pill-dot" />
            </Link>
            <button onClick={() => setOpen(!open)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:text-white transition-colors md:hidden"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 md:hidden"
        style={{
          background: "#0A0A0A",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}>
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href}
            className="text-2xl font-bold transition-colors"
            style={{ color: pathname === l.href ? "#D9F25D" : "#FFFFFF" }}>
            {l.label}
          </Link>
        ))}
        <Link href={isLoggedIn ? "/dashboard" : "/register"} className="pill-lime mt-4">
          {isLoggedIn ? "Masuk Dashboard" : "Daftar Sekarang"}
          <span className="pill-dot" />
        </Link>
      </div>
    </>
  )
}


