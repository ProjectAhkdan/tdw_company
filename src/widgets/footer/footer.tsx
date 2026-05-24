"use client"

import Link from "next/link"
import { useState } from "react"

const SocialIcons = {
  Instagram: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Youtube: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
    </svg>
  ),
  Linkedin: () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
    </svg>
  ),
}

const SOCIALS = [
  { Icon: SocialIcons.Instagram, href: "https://instagram.com/tdwresources", label: "Instagram" },
  { Icon: SocialIcons.Youtube, href: "https://youtube.com/@tdwresources", label: "YouTube" },
  { Icon: SocialIcons.Linkedin, href: "#", label: "LinkedIn" },
]

const PROGRAMS = ["Life Revolution", "Business Revolution", "Financial Revolution", "Jadwal Seminar"]
const COMPANY: [string, string][] = [["Tentang Kami", "/about"], ["Blog", "/blog"], ["Seminar", "/seminars"]]

export function Footer() {
  const [email, setEmail] = useState("")

  return (
    <footer style={{ background: "#0A0A0A" }}>
      {/* ── Let's Talk CTA ── */}
      <section className="border-t px-6 py-20" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="section-label mb-4">Hubungi Kami</p>
              <h2 className="text-[clamp(48px,8vw,80px)] font-black leading-none tracking-tight text-white">
                Let&apos;s Talk
              </h2>
            </div>
            <div className="flex flex-col gap-1 pt-2 text-right">
              <a href="tel:02154766677" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                (021) 547-6677
              </a>
              <a href="mailto:info@dahsyat.com" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
                info@dahsyat.com
              </a>
            </div>
          </div>

          {/* Email form */}
          <div className="relative mt-10 max-w-md">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-14 w-full rounded-full pr-16 pl-6 text-sm text-white outline-none"
              style={{ background: "#1A1A1A", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full text-black font-bold text-lg"
              style={{ background: "#D9F25D" }}
              aria-label="Subscribe"
            >
              →
            </button>
          </div>

          {/* Social icons */}
          <div className="mt-8 flex items-center gap-5">
            {SOCIALS.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="transition-colors" style={{ color: "#8A8A8A" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#FFFFFF"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#8A8A8A"}
                aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer columns ── */}
      <section className="border-t px-6 pb-8 pt-14" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-[1280px]">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Col 1 */}
            <div>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black"
                  style={{ background: "#D9F25D", color: "#0A0A0A" }}>T</div>
                <span className="text-base font-semibold text-white">TDW Resources</span>
              </Link>
              <p className="mt-3 max-w-[220px] text-xs leading-relaxed" style={{ color: "#5A5A5A" }}>
                Investasi Terbaik Adalah Investasi Pada Diri Sendiri
              </p>
            </div>

            {/* Col 2 — Program */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Program</p>
              <ul className="space-y-2.5">
                {PROGRAMS.map(l => (
                  <li key={l}>
                    <Link href="/seminars" className="text-[13px] transition-colors hover:text-[#CECECE]"
                      style={{ color: "#5A5A5A" }}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Perusahaan */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Perusahaan</p>
              <ul className="space-y-2.5">
                {COMPANY.map(([l, h]) => (
                  <li key={l}>
                    <Link href={h} className="text-[13px] transition-colors hover:text-[#CECECE]"
                      style={{ color: "#5A5A5A" }}>{l}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Kontak */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#8A8A8A" }}>Kontak</p>
              <ul className="space-y-2.5 text-[13px]" style={{ color: "#5A5A5A" }}>
                <li><a href="tel:02154766677" className="hover:text-[#CECECE] transition-colors">(021) 547-6677</a></li>
                <li><a href="mailto:info@dahsyat.com" className="hover:text-[#CECECE] transition-colors">info@dahsyat.com</a></li>
                <li><a href="https://tdwresources.id" className="hover:text-[#CECECE] transition-colors">tdwresources.id</a></li>
                <li className="leading-relaxed">Jl. Janur Hijau 1, Blok AA-5 No. 16-17,<br />Gading Serpong, Tangerang 15810</li>
              </ul>
            </div>
          </div>

          {/* Copyright bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row"
            style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <p className="text-xs" style={{ color: "#3A3A3A" }}>© 2026 TDW Resources. All rights reserved.</p>
            <div className="flex gap-4 text-xs" style={{ color: "#3A3A3A" }}>
              <Link href="/privacy" className="hover:text-white/50 transition-colors">Kebijakan Privasi</Link>
              <span>·</span>
              <Link href="/privacy" className="hover:text-white/50 transition-colors">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  )
}


