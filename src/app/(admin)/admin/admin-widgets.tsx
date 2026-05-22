"use client"

import Link from "next/link"
import { Clock, AlertCircle, ArrowRight, CalendarDays, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ORANGE      = "oklch(0.72 0.18 55)"
const ORANGE_BG   = "oklch(0.97 0.04 60)"
const ORANGE_TEXT = "oklch(0.45 0.15 50)"

/* ── Alert links (hover interactive) ─────────────────────────────────────── */
export type AlertItem = {
  href: string
  badgeClass: string
  badgeText: string
  text: string
  iconName: "Clock" | "AlertCircle"
}

const iconMap: Record<string, LucideIcon> = { Clock, AlertCircle }

export function AdminAlerts({ alerts }: { alerts: AlertItem[] }) {
  if (alerts.length === 0) return null
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {alerts.map(a => {
        const Icon = iconMap[a.iconName]
        return (
          <Link key={a.href} href={a.href}
            className="admin-alert-card"
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "#fff", border: "1px solid #E5E7EB",
              borderRadius: 12, padding: "12px 16px",
              textDecoration: "none",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              transition: "border-color 0.15s, box-shadow 0.15s",
            }}
          >
            <Icon style={{ width: 16, height: 16, color: ORANGE, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: "0.875rem", color: "#374151" }}>{a.text}</span>
            <span className={a.badgeClass}>{a.badgeText}</span>
            <ArrowRight style={{ width: 14, height: 14, color: "#9CA3AF" }} />
          </Link>
        )
      })}
      <style>{`
        .admin-alert-card:hover { border-color: oklch(0.72 0.18 55) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important; }
      `}</style>
    </div>
  )
}

/* ── Quick action items (hover interactive) ───────────────────────────────── */
export type QuickActionItem = {
  href: string
  label: string
  desc: string
  iconName: "CalendarDays" | "Clock" | "ArrowRight" | "TrendingUp"
}

const qaIconMap: Record<string, LucideIcon> = { CalendarDays, Clock, ArrowRight, TrendingUp }

export function AdminQuickActions({ actions }: { actions: QuickActionItem[] }) {
  return (
    <>
      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 12 }}>
        Aksi Cepat
      </p>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
        {actions.map(a => {
          const Icon = qaIconMap[a.iconName] ?? ArrowRight
          return (
            <Link key={a.href} href={a.href}
              className="admin-qa-card"
              style={{
                display: "flex", alignItems: "center", gap: 14,
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 14, padding: "14px 16px",
                textDecoration: "none",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: ORANGE_BG,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon style={{ width: 16, height: 16, color: ORANGE }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#111827", margin: 0 }}>{a.label}</p>
                <p style={{ fontSize: "0.75rem", color: "#9CA3AF", marginTop: 2 }}>{a.desc}</p>
              </div>
              <ArrowRight style={{ width: 14, height: 14, color: "#D1D5DB", flexShrink: 0 }} />
            </Link>
          )
        })}
      </div>
      <style>{`
        .admin-qa-card:hover { border-color: oklch(0.72 0.18 55) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
      `}</style>
    </>
  )
}
