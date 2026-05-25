export const dynamic = 'force-dynamic'

import nextDynamic from "next/dynamic"
import { getUpcomingSchedules } from "@/infrastructure/storage/supabase-queries"
import { ScheduleFilters } from "./schedule-filters"
import { ScheduleList } from "./schedule-list"
import { AlertCircle } from "lucide-react"
import { DarkVeilHero } from "@/shared/ui/dark-veil-hero"

const GOLD = "#D9F25D"

interface Props {
  searchParams: Promise<{ month?: string; city?: string; view?: "list" | "grid" }>
}

export default async function SchedulePage({ searchParams }: Props) {
  const { data: rawSchedules, error } = await getUpcomingSchedules()
  const data = rawSchedules ?? []
  const sp = await searchParams

  const monthKey = sp.month || "all"
  const city = sp.city || "Semua Kota"
  const view = sp.view || "list"

  // Derive available months & cities from data
  const seenMonths = new Set<string>()
  const months: { key: string; label: string; year: number; month: number }[] = []
  data.forEach((s) => {
    const d = new Date(s.start_date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (!seenMonths.has(key)) {
      seenMonths.add(key)
      months.push({
        key,
        label: d.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
        year: d.getFullYear(),
        month: d.getMonth(),
      })
    }
  })

  const seenCities = new Set(data.map((s) => s.city))
  const cities = ["Semua Kota", ...Array.from(seenCities).sort()]

  const filtered = data.filter((s) => {
    const d = new Date(s.start_date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const matchMonth = monthKey === "all" || key === monthKey
    const matchCity = city === "Semua Kota" || s.city === city
    return matchMonth && matchCity
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden py-28 px-6 text-center">
        <DarkVeilHero />
        <div className="relative z-10">
          <div className="mb-4 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Jadwal
          </div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Seminar & Training
          </h1>
          <p className="mt-4 text-muted-foreground">Temukan program yang tepat untuk transformasi bisnis dan kehidupan Anda</p>
        </div>
      </section>

      <ScheduleFilters months={months} cities={cities} />

      {error && (
        <div className="mx-auto mt-6 max-w-6xl px-6">
          <div className="flex items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-400">
            <AlertCircle className="size-4 shrink-0" />
            Menggunakan data contoh. {error?.message}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-10">
        <ScheduleList schedules={filtered} view={view as any} />
      </div>
    </div>
  )
}


