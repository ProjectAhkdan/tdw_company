"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"

const GOLD = "#D9F25D"

interface Props {
  categories: { id: string; name: string; color: string | null }[]
}

export function SeminarFilters({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const search = searchParams.get("q") || ""
  const categoryId = searchParams.get("cat") || "all"
  const sort = searchParams.get("sort") || "newest"

  const SORT_OPTIONS = [
    { value: "newest", label: "Terbaru" },
    { value: "cheapest", label: "Termurah" },
    { value: "popular", label: "Featured" },
  ]

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all" && value !== "newest") params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="sticky top-[72px] z-30 border-b px-6 py-4"
      style={{ background: "oklch(0.07 0.005 260 / 0.92)", backdropFilter: "blur(16px)", borderColor: "oklch(0.22 0.01 55 / 0.3)" }}>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input value={search} onChange={e => updateParams("q", e.target.value)}
            placeholder="Cari seminar..."
            className="h-9 w-full rounded-xl border pl-9 pr-4 text-sm outline-none transition-colors"
            style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} />
        </div>
        <div className="flex gap-1 rounded-xl border p-1 overflow-x-auto"
          style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
          <button onClick={() => updateParams("cat", "all")}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
            style={categoryId === "all" ? { background: GOLD, color: "#0A0A0A" } : { color: "oklch(0.55 0.01 60)" }}>
            Semua
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => updateParams("cat", c.id)}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={categoryId === c.id ? { background: GOLD, color: "#0A0A0A" } : { color: "oklch(0.55 0.01 60)" }}>
              {c.name}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-muted-foreground" />
          <select value={sort} onChange={e => updateParams("sort", e.target.value)}
            className="h-9 rounded-xl border px-3 text-xs outline-none"
            style={{ background: "oklch(0.10 0.006 55)", borderColor: "oklch(0.22 0.01 55 / 0.4)", color: "oklch(0.75 0.005 60)" }}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  )
}
