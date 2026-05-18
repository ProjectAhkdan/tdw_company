"use client"

import { PillButton } from "@/shared/ui/button"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useLocale } from "@/shared/hooks/use-locale"

const navLinks = [
  { href: "/seminars", label: "Seminar" },
  { href: "/schedule", label: "Jadwal" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Tentang Kami" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { locale, setLocale } = useLocale()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <>
      <header
        className="fixed top-0 z-50 w-full transition-all duration-500"
        style={{
          background: scrolled
            ? "oklch(0.07 0.005 260 / 0.85)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid oklch(0.22 0.01 55 / 0.3)" : "1px solid transparent",
        }}
      >
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all duration-300 group-hover:scale-105"
              style={{ background: "oklch(0.78 0.16 55)", color: "oklch(0.08 0 0)" }}
            >
              TDW
            </div>
            <span
              className="text-lg font-semibold tracking-tight transition-colors"
              style={{ fontFamily: "'Playfair Display', serif", color: "oklch(0.96 0.005 60)" }}
            >
              Resources
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="link-underline relative px-4 py-2 text-sm font-medium transition-colors duration-200"
                  style={{
                    color: active ? "oklch(0.78 0.16 55)" : "oklch(0.65 0.01 60)",
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "oklch(0.96 0.005 60)"
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.01 60)"
                  }}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <button
              onClick={() => setLocale(locale === 'id' ? 'en' : 'id')}
              className="hidden h-7 items-center rounded-lg px-2.5 text-xs font-semibold transition-all md:flex"
              style={{ background: "oklch(0.14 0.01 55)", color: "oklch(0.65 0.01 60)" }}
              title="Switch language"
            >
              {locale === 'id' ? '🇮🇩 ID' : '🇬🇧 EN'}
            </button>
            <Link
              href="/login"
              className="hidden h-9 items-center rounded-lg px-4 text-sm font-medium transition-all duration-200 md:inline-flex"
              style={{
                color: "oklch(0.65 0.01 60)",
                border: "1px solid oklch(0.22 0.01 55 / 0.5)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.96 0.005 60)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.01 60)" }}
            >
              Masuk
            </Link>
            <Link href="/register" className="hidden md:inline-flex">
              <PillButton
                pillColor="oklch(0.78 0.16 55)"
                textColor="oklch(0.08 0 0)"
                hoverCircleColor="#120F17"
                hoverTextColor="oklch(0.78 0.16 55)"
              >
                Daftar
              </PillButton>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors md:hidden"
              style={{
                background: "oklch(0.14 0.01 55)",
                color: "oklch(0.78 0.16 55)",
              }}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300 md:hidden"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          background: "oklch(0.07 0.005 260 / 0.95)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <nav className="flex h-full flex-col items-center justify-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-2xl font-medium transition-all duration-200"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: pathname === link.href ? "oklch(0.78 0.16 55)" : "oklch(0.75 0.005 60)",
                transitionDelay: open ? `${i * 60}ms` : "0ms",
                transform: open ? "translateY(0)" : "translateY(20px)",
                opacity: open ? 1 : 0,
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="mt-2 inline-flex h-12 items-center rounded-xl px-8 text-base font-medium transition-all duration-200"
            style={{
              border: "1px solid oklch(0.22 0.01 55 / 0.5)",
              color: "oklch(0.75 0.005 60)",
              transitionDelay: open ? `${(navLinks.length + 1) * 60}ms` : "0ms",
              transform: open ? "translateY(0)" : "translateY(20px)",
              opacity: open ? 1 : 0,
            }}
          >
            Masuk
          </Link>
          <PillButton
              pillColor="oklch(0.78 0.16 55)"
                textColor="oklch(0.08 0 0)"
                hoverCircleColor="#120F17"
                hoverTextColor="oklch(0.78 0.16 55)"
              onClick={() => { setOpen(false); window.location.href = '/register' }}
              style={{
                transitionDelay: open ? `${navLinks.length * 60}ms` : "0ms",
                transform: open ? "translateY(0)" : "translateY(20px)",
                opacity: open ? 1 : 0,
              }}
            >
              Daftar
            </PillButton>
        </nav>
      </div>
    </>
  )
}

