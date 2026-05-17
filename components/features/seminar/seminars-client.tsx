"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { SeminarCard, SeminarCardSkeleton } from "@/components/features/seminar/seminar-card"
import type { SeminarListItem } from "@/lib/supabase/queries"

const GOLD = "oklch(0.78 0.16 55)"

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "cheapest", label: "Termurah" },
  { value: "popular", label: "Featured" },
] as const

type Sort = typeof SORT_OPTIONS[number]["value"]

interface Props {
  seminars: SeminarListItem[]
  categories: { id: string; name: string; color: string | null }[]
}

export default function SeminarsClient({ seminars, categories }: Props) {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("all")
  const [sort, setSort] = useState<Sort>("newest")

  const filtered = useMemo(() => {
    let list = [...seminars]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.short_desc.toLowerCase().includes(q) ||
        s.category.name.toLowerCase().includes(q)
      )
    }

    if (categoryId !== "all") list = list.filter(s => s.category.id === categoryId)

    if (sort === "cheapest") {
      list.sort((a, b) => {
        const pa = Math.min(...a.schedules.flatMap(s => s.tickets.map(t => t.early_bird_price ?? t.price)), Infinity)
        const pb = Math.min(...b.schedules.flatMap(s => s.tickets.map(t => t.early_bird_price ?? t.price)), Infinity)
        return pa - pb
      })
    } else if (sort === "popular") {
      list.sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
    }

    return list
  }, [seminars, search, categoryId, sort])

  return (
    <div>
      {/* ── Filters bar ─────────────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-30 border-b px-6 py-4"
        style={{ background: "oklch(0.07 0.005 260 / 0.92)", backdropFilter: "blur(16px)", borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari seminar..."
              className="h-9 w-full rounded-xl border pl-9 pr-4 text-sm outline-none transition-colors"
              style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }}
            />
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 rounded-xl border p-1 overflow-x-auto"
            style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
            <button onClick={() => setCategoryId("all")}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={categoryId === "all" ? { background: GOLD, color: "oklch(0.08 0 0)" } : { color: "oklch(0.55 0.01 60)" }}>
              Semua
            </button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setCategoryId(c.id)}
                className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={categoryId === c.id ? { background: GOLD, color: "oklch(0.08 0 0)" } : { color: "oklch(0.55 0.01 60)" }}>
                {c.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <select value={sort} onChange={e => setSort(e.target.value as Sort)}
              className="h-9 rounded-xl border px-3 text-xs outline-none"
              style={{ background: "oklch(0.10 0.006 55)", borderColor: "oklch(0.22 0.01 55 / 0.4)", color: "oklch(0.75 0.005 60)" }}>
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <p className="mb-6 text-sm text-muted-foreground">
          {filtered.length} seminar ditemukan
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl opacity-20">🔍</div>
            <h3 className="text-lg font-semibold">Tidak ada seminar ditemukan</h3>
            <p className="mt-2 text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
            <button onClick={() => { setSearch(""); setCategoryId("all"); setSort("newest") }}
              className="mt-6 rounded-xl px-5 py-2 text-sm font-medium transition-all hover:opacity-90"
              style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(s => <SeminarCard key={s.id} seminar={s} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export function SeminarsLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 h-4 w-32 rounded bg-muted/30 animate-pulse" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => <SeminarCardSkeleton key={i} />)}
      </div>
    </div>
  )
}
