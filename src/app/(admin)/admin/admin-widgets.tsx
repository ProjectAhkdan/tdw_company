"use client"

import Link from "next/link"
import { Clock, AlertCircle, ArrowRight, CalendarDays, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const LIME = "#D9F25D"
const BORDER = "oklch(0.22 0.01 255 / 0.35)"

const iconMap: Record<string, LucideIcon> = { Clock, AlertCircle }

export type AlertItem = {
  href: string
  badgeClass: string
  badgeText: string
  text: string
  iconName: "Clock" | "AlertCircle"
}

export function AdminAlerts({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) return null
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {alerts.map(a => {
        const Icon = iconMap[a.iconName]
        return (
          <Link key={a.href} href={a.href}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.25)",
              borderLeft: "3px solid #FB923C", borderRadius: 12, padding: "12px 16px",
              textDecoration: "none", backdropFilter: "blur(8px)", transition: "background 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(251,146,60,0.12)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(251,146,60,0.08)"}
          >
            <Icon style={{ width: 16, height: 16, color: "#FB923C", flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: "0.875rem", color: "oklch(0.9 0.005 60)" }}>{a.text}</span>
            <span style={{ background: "rgba(251,146,60,0.15)", color: "#FB923C", borderRadius: 999, padding: "2px 10px", fontSize: 11.5, fontWeight: 600 }}>{a.badgeText}</span>
            <ArrowRight style={{ width: 14, height: 14, color: "oklch(0.42 0.008 60)" }} />
          </Link>
        )
      })}
    </div>
  )
}

export type QuickActionItem = {
  href: string
  label: string
  desc: string
  iconName: "CalendarDays" | "Clock" | "ArrowRight" | "TrendingUp"
}

const qaIconMap: Record<string, LucideIcon> = { CalendarDays, Clock, ArrowRight, TrendingUp }

const qaGradients = [
  "linear-gradient(135deg, rgba(217,242,93,0.2), rgba(217,242,93,0.08))",
  "linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.08))",
  "linear-gradient(135deg, rgba(52,211,153,0.2), rgba(52,211,153,0.08))",
  "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(167,139,250,0.08))",
]
const qaIconColors = [LIME, "#60A5FA", "#34D399", "#A78BFA"]

export function AdminQuickActions({ actions }: { actions: QuickActionItem[] }) {
  return (
    <>
      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "oklch(0.42 0.008 60)", marginBottom: 12 }}>
        Aksi Cepat
      </p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {actions.map((a, i) => {
          const Icon = qaIconMap[a.iconName] ?? ArrowRight
          return (
            <Link key={a.href} href={a.href}
              style={{
                display: "flex", flexDirection: "column", gap: 8,
                padding: 16, background: "oklch(0.11 0.009 255 / 0.6)",
                border: `1px solid ${BORDER}`, borderRadius: 16,
                textDecoration: "none", backdropFilter: "blur(12px)",
                transition: "all 0.2s", cursor: "pointer",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(217,242,93,0.35)"; (e.currentTarget as HTMLElement).style.background = "oklch(0.13 0.012 255 / 0.7)" }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.background = "oklch(0.11 0.009 255 / 0.6)" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, background: qaGradients[i % 4], display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon style={{ width: 16, height: 16, color: qaIconColors[i % 4] }} />
              </div>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "oklch(0.9 0.005 60)", margin: 0 }}>{a.label}</p>
                <p style={{ fontSize: "0.75rem", color: "oklch(0.55 0.01 60)", marginTop: 2 }}>{a.desc}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}



