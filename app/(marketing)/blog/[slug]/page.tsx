import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import type { Metadata } from "next"
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react"
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/supabase/queries"
import MarkdownContent from "./markdown-content"

const GOLD = "oklch(0.78 0.16 55)"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://tdwresources.id"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data } = await getBlogPostBySlug(slug)
  if (!data) return { title: "Artikel Tidak Ditemukan" }
  return {
    title: data.title,
    description: data.excerpt,
    alternates: { canonical: `${APP_URL}/blog/${slug}` },
    openGraph: {
      title: data.title, description: data.excerpt, type: "article",
      images: data.thumbnail_url ? [data.thumbnail_url] : [],
      publishedTime: data.published_at, authors: [data.author_name],
      url: `${APP_URL}/blog/${slug}`,
    },
    twitter: { card: "summary_large_image", title: data.title, description: data.excerpt },
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: post } = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(slug, post.category)
  const shareUrl = `${APP_URL}/blog/${slug}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Article',
        headline: post.title, description: post.excerpt,
        author: { '@type': 'Person', name: post.author_name },
        datePublished: post.published_at,
        image: post.thumbnail_url ?? undefined,
        url: `${APP_URL}/blog/${slug}`,
        publisher: { '@type': 'Organization', name: 'TDW Resources', url: APP_URL },
      }) }} />
      <article className="mx-auto max-w-3xl px-6 py-16">
        {/* Back */}
        <Link href="/blog" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="size-4" /> Kembali ke Blog
        </Link>

        {/* Category */}
        {post.category && (
          <span className="mb-4 inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: `${GOLD}20`, color: GOLD }}>
            {post.category}
          </span>
        )}

        <h1 className="text-4xl font-bold leading-tight sm:text-5xl" style={{ fontFamily: "'Playfair Display', serif" }}>
          {post.title}
        </h1>

        {/* Meta */}
        <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" style={{ color: GOLD }} />
            {new Date(post.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
          </span>
          {post.read_time && (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" style={{ color: GOLD }} />
              {post.read_time} menit baca
            </span>
          )}
        </div>

        {/* Thumbnail */}
        <div className="relative mt-8 h-64 w-full overflow-hidden rounded-2xl sm:h-80"
          style={{ background: `${GOLD}08` }}>
          {post.thumbnail_url ? (
            <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover" priority />
          ) : (
            <div className="flex h-full items-center justify-center text-6xl font-bold opacity-10"
              style={{ fontFamily: "'Playfair Display', serif" }}>TDW</div>
          )}
        </div>

        {/* Content */}
        <div className="mt-10">
          <MarkdownContent content={post.content} />
        </div>

        {/* Author card */}
        <div className="mt-12 glass rounded-2xl p-6 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
            style={{ background: `${GOLD}20`, color: GOLD }}>TDW</div>
          <div>
            <p className="font-semibold">{post.author_name}</p>
            <p className="text-sm text-muted-foreground">Motivator & Business Coach #1 Indonesia</p>
          </div>
        </div>

        {/* Share */}
        <div className="mt-8 flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Share2 className="size-4" /> Bagikan:
          </span>
          {[
            { label: "Twitter/X", href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
            { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
            { label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(post.title + " " + shareUrl)}` },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:opacity-80"
              style={{ background: `${GOLD}15`, color: GOLD }}>
              {s.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 glass rounded-2xl p-6 text-center" style={{ border: `1px solid ${GOLD}20` }}>
          <p className="font-semibold">Ingin belajar lebih dalam bersama TDW?</p>
          <p className="mt-1 text-sm text-muted-foreground">Ikuti seminar dan raih transformasi nyata dalam hidup Anda.</p>
          <Link href="/seminars"
            className="mt-4 inline-flex h-10 items-center rounded-xl px-6 text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
            Lihat Seminar
          </Link>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="mb-6 text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Artikel Terkait</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`}
                className="glass glass-hover rounded-2xl p-5 transition-all">
                <span className="text-xs font-medium" style={{ color: GOLD }}>{r.category}</span>
                <h3 className="mt-2 font-semibold leading-snug line-clamp-2">{r.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
