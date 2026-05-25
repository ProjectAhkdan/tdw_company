"use client"

import { LayoutGrid, List } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const GOLD = "#D9F25D"

interface Props {
  months: { key: string; label: string }[]
  cities: string[]
}

export function ScheduleFilters({ months, cities }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const monthKey = searchParams.get("month") || "all"
  const city = searchParams.get("city") || "Semua Kota"
  const view = searchParams.get("view") || "list"

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all" && value !== "Semua Kota" && value !== "list") {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="sticky top-[72px] z-30 border-b px-6 py-4"
      style={{ background: "oklch(0.07 0.005 260 / 0.9)", backdropFilter: "blur(16px)", borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        {/* Month filter */}
        <div className="flex gap-1 rounded-xl border p-1"
          style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
          <button
            onClick={() => updateParams("month", "all")}
            className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer"
            style={monthKey === "all"
              ? { background: GOLD, color: "#0A0A0A" }
              : { color: "oklch(0.58 0.01 60)" }}>
            Semua
          </button>
          {months.map((m) => (
            <button
              key={m.key}
              onClick={() => updateParams("month", m.key)}
              className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer"
              style={monthKey === m.key
                ? { background: GOLD, color: "#0A0A0A" }
                : { color: "oklch(0.58 0.01 60)" }}>
              {m.label}
            </button>
          ))}
        </div>

        {/* City filter */}
        <select
          value={city}
          onChange={(e) => updateParams("city", e.target.value)}
          className="rounded-xl border px-4 py-2 text-sm transition-colors"
          style={{
            borderColor: "oklch(0.22 0.01 55 / 0.4)",
            background: "oklch(0.10 0.006 55)",
            color: "oklch(0.75 0.005 60)",
          }}>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* View toggle */}
        <div className="ml-auto flex gap-1 rounded-xl border p-1"
          style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
          <button
            onClick={() => updateParams("view", "list")}
            className="rounded-lg p-2 transition-all duration-200 cursor-pointer"
            style={view === "list" ? { background: GOLD, color: "#0A0A0A" } : { color: "oklch(0.58 0.01 60)" }}>
            <List className="size-4" />
          </button>
          <button
            onClick={() => updateParams("view", "grid")}
            className="rounded-lg p-2 transition-all duration-200 cursor-pointer"
            style={view === "grid" ? { background: GOLD, color: "#0A0A0A" } : { color: "oklch(0.58 0.01 60)" }}>
            <LayoutGrid className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


