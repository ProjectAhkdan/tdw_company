import { Suspense } from "react"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { getSeminars, getCategories } from "@/infrastructure/storage/supabase-queries"
import { SeminarFilters } from "@/features/seminar/ui/seminar-filters"
import { SeminarList, SeminarsLoadingSkeleton } from "@/features/seminar/ui/seminar-list"

const DarkVeil = dynamic(() => import("@/shared/ui/dark-veil"), { ssr: false })
export const metadata: Metadata = {
  title: "Seminar & Training",
  description: "Temukan seminar bisnis, properti, dan pengembangan diri bersama Tung Desem Waringin. Daftar sekarang dan transformasi hidup Anda.",
  openGraph: { title: "Seminar & Training — TDW Resources", description: "Seminar bisnis, properti, dan pengembangan diri terpercaya di Indonesia." },
}

const GOLD = "#D9F25D"

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
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <DarkVeil speed={0.4} hueShift={0} noiseIntensity={0.02} warpAmount={0.3} />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10">
          <div className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Seminar & Training
          </div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Seminar & Training
          </h1>
          <p className="mt-4 text-muted-foreground">Temukan program yang tepat untuk transformasi bisnis dan kehidupan Anda</p>
        </div>
      </section>
      <Suspense fallback={<SeminarsLoadingSkeleton />}>
        <SeminarsContent searchParams={sp} />
      </Suspense>
    </div>
  )
}


