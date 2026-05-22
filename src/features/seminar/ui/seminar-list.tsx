import Link from "next/link"
import { SeminarCard, SeminarCardSkeleton } from "@/features/seminar/ui/seminar-card"
import type { SeminarListItem } from "@/infrastructure/storage/supabase-queries"
import { PillButton } from "@shared/ui/button"

const GOLD = "oklch(0.78 0.16 55)"

interface Props {
  seminars: SeminarListItem[]
  searchParams?: Record<string, string>
}

export function SeminarList({ seminars, searchParams }: Props) {
  const search = (searchParams?.q || "").toLowerCase()
  const categoryId = searchParams?.cat || "all"
  const sort = searchParams?.sort || "newest"

  let list = [...seminars]

  if (search.trim()) {
    list = list.filter(s =>
      s.title.toLowerCase().includes(search) ||
      s.short_desc.toLowerCase().includes(search) ||
      s.category.name.toLowerCase().includes(search)
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="mb-6 text-sm text-muted-foreground">
        {list.length} seminar ditemukan
      </p>

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 text-5xl opacity-20">🔍</div>
          <h3 className="text-lg font-semibold">Tidak ada seminar ditemukan</h3>
          <p className="mt-2 text-sm text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
          <Link href="/seminars" className="mt-6 inline-flex h-10 items-center justify-center rounded-full px-6 font-medium transition-all"
            style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map(s => <SeminarCard key={s.id} seminar={s} />)}
        </div>
      )}
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
