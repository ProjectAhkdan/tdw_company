import { Suspense } from "react"
import { getBlogPosts, getBlogCategories } from "@/lib/supabase/queries"
import BlogListClient from "./blog-client"

export const revalidate = 600 // ISR: revalidate every 10 minutes

const GOLD = "oklch(0.78 0.16 55)"

async function BlogContent({ searchParams }: { searchParams: Record<string, string> }) {
  const [{ data: posts }, categories] = await Promise.all([
    getBlogPosts({ category: searchParams.cat, search: searchParams.q, page: Number(searchParams.page ?? 1) }),
    getBlogCategories(),
  ])
  return <BlogListClient posts={posts ?? []} categories={categories} />
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full opacity-[0.08] blur-[80px]"
            style={{ background: GOLD }} />
        </div>
        <div className="relative z-10">
          <div className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>Blog & Artikel</div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Insight dari TDW</h1>
          <p className="mt-4 text-muted-foreground">Strategi bisnis, properti, dan pengembangan diri</p>
        </div>
      </section>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-10 text-center text-muted-foreground">Memuat artikel...</div>}>
        <BlogContent searchParams={sp} />
      </Suspense>
    </div>
  )
}
