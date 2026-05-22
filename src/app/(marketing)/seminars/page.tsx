import { Suspense } from "react"
import type { Metadata } from "next"
import { getSeminars, getCategories } from "@/infrastructure/storage/supabase-queries"
import { SeminarFilters } from "@/features/seminar/ui/seminar-filters"
import { SeminarList, SeminarsLoadingSkeleton } from "@/features/seminar/ui/seminar-list"

export const metadata: Metadata = {
  title: "Seminar & Training",
  description: "Temukan seminar bisnis, properti, dan pengembangan diri bersama Tung Desem Waringin. Daftar sekarang dan transformasi hidup Anda.",
  openGraph: { title: "Seminar & Training — TDW Resources", description: "Seminar bisnis, properti, dan pengembangan diri terpercaya di Indonesia." },
}

const GOLD = "oklch(0.78 0.16 55)"

interface Props {
  searchParams: Promise<Record<string, string>>
}

async function SeminarsContent({ searchParams }: { searchParams: Record<string, string> }) {
  const [{ data: seminars }, { data: categories }] = await Promise.all([
    getSeminars(),
    getCategories(),
  ])

  return (
    <>
      <SeminarFilters categories={categories ?? []} />
      <SeminarList seminars={seminars ?? []} searchParams={searchParams} />
    </>
  )
}

export default async function SeminarsPage({ searchParams }: Props) {
  const sp = await searchParams
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full opacity-[0.08] blur-[80px]"
            style={{ background: GOLD }} />
        </div>
        <div className="relative z-10">
          <div className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Program Kami
          </div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Seminar & Training
          </h1>
          <p className="mt-4 text-muted-foreground">
            Temukan program yang tepat untuk transformasi bisnis dan kehidupan Anda
          </p>
        </div>
      </section>

      {/* Content */}
      <Suspense fallback={<SeminarsLoadingSkeleton />}>
        <SeminarsContent searchParams={sp} />
      </Suspense>
    </div>
  )
}
