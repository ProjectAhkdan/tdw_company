"use client"

import { Search } from "lucide-react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useTransition, useState, useEffect } from "react"

const GOLD = "#D9F25D"

export function BlogFilters({ categories }: { categories: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentCat = searchParams.get("cat") || "all"
  const currentQ = searchParams.get("q") || ""
  const [search, setSearch] = useState(currentQ)

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== currentQ) {
        updateFilters(search, currentCat)
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  function updateFilters(q: string, cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (q) params.set("q", q)
    else params.delete("q")
    
    if (cat && cat !== "all") params.set("cat", cat)
    else params.delete("cat")

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Cari artikel..."
          className="h-9 w-full rounded-xl border pl-9 pr-4 text-sm outline-none"
          style={{ background: "oklch(0.11 0.008 55)", borderColor: "oklch(0.22 0.01 55 / 0.5)", color: "oklch(0.9 0 0)" }} 
        />
        {isPending && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-transparent border-t-primary" style={{ borderTopColor: GOLD }} />
          </div>
        )}
      </div>
      <div className="flex gap-1 rounded-xl border p-1 overflow-x-auto"
        style={{ borderColor: "oklch(0.22 0.01 55 / 0.4)", background: "oklch(0.10 0.006 55)" }}>
        {["all", ...categories].map(c => (
          <button key={c} onClick={() => updateFilters(search, c)}
            className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
            style={currentCat === c ? { background: GOLD, color: "#0A0A0A" } : { color: "oklch(0.55 0.01 60)" }}>
            {c === "all" ? "Semua" : c}
          </button>
        ))}
      </div>
    </div>
  )
}
