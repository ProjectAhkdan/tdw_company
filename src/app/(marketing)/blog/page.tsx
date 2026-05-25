export const dynamic = 'force-dynamic'

import { Suspense } from "react"
import nextDynamic from "next/dynamic"
import { getBlogPosts, getBlogCategories } from "@/infrastructure/storage/supabase-queries"
import { BlogList } from "./blog-list"
import { DarkVeilHero } from "@/shared/ui/dark-veil-hero"

const GOLD = "#D9F25D"

async function BlogContent({ searchParams }: { searchParams: Record<string, string> }) {
  const [{ data: posts }, categories] = await Promise.all([
    getBlogPosts({ category: searchParams.cat, search: searchParams.q, page: Number(searchParams.page ?? 1) }),
    getBlogCategories(),
  ])
  return <BlogList posts={posts ?? []} categories={categories} />
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden py-24 px-6 text-center">
        <DarkVeilHero />
        <div className="relative z-10">
          <div className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>Blog & Artikel</div>
          <h1 className="text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Blog & Artikel</h1>
          <p className="mt-4 text-muted-foreground">Strategi bisnis, properti, dan pengembangan diri</p>
        </div>
      </section>
      <Suspense fallback={<div className="mx-auto max-w-6xl px-6 py-10 text-center text-muted-foreground">Memuat...</div>}>
        <BlogContent searchParams={sp} />
      </Suspense>
    </div>
  )
}


