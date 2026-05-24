import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"
import type { BlogPost } from "@/infrastructure/storage/supabase-queries"
import { BlogFilters } from "./blog-filters"

const GOLD = "#D9F25D"

const FALLBACK: BlogPost[] = [
  { id: "1", slug: "strategi-investasi-properti-2026", title: "Strategi Investasi Properti di 2026", excerpt: "Pasar properti Indonesia terus berkembang. Pelajari strategi terbaik untuk memaksimalkan return investasi Anda.", thumbnail_url: null, author_name: "Tung Desem Waringin", category: "Properti", tags: ["properti"], read_time: 5, published_at: "2026-05-10T00:00:00Z", created_at: "2026-05-10T00:00:00Z" },
  { id: "2", slug: "teknik-closing-sales-terbukti", title: "7 Teknik Closing Sales yang Terbukti Efektif", excerpt: "Tingkatkan closing rate Anda dengan teknik-teknik yang telah digunakan oleh ribuan sales professional.", thumbnail_url: null, author_name: "Tung Desem Waringin", category: "Sales", tags: ["sales"], read_time: 7, published_at: "2026-05-05T00:00:00Z", created_at: "2026-05-05T00:00:00Z" },
  { id: "3", slug: "mindset-pengusaha-sukses", title: "Mindset yang Wajib Dimiliki Pengusaha Sukses", excerpt: "Apa yang membedakan pengusaha sukses dari yang lain? Temukan jawabannya dalam artikel ini.", thumbnail_url: null, author_name: "Tung Desem Waringin", category: "Bisnis", tags: ["bisnis"], read_time: 6, published_at: "2026-04-28T00:00:00Z", created_at: "2026-04-28T00:00:00Z" },
]

export function BlogList({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const data = posts.length ? posts : FALLBACK

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20">
      <BlogFilters categories={categories} />

      {data.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">Tidak ada artikel ditemukan.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`}
              className="glass glass-hover group flex flex-col rounded-2xl overflow-hidden">
              <div className="relative h-44 w-full overflow-hidden"
                style={{ background: `${GOLD}08` }}>
                {post.thumbnail_url ? (
                  <Image src={post.thumbnail_url} alt={post.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="flex h-full items-center justify-center text-4xl font-bold opacity-10"
                    style={{ fontFamily: "'Playfair Display', serif" }}>TDW</div>
                )}
                {post.category && (
                  <span className="absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm"
                    style={{ background: `${GOLD}25`, color: GOLD }}>
                    {post.category}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h2 className="line-clamp-2 font-semibold leading-snug group-hover:text-[oklch(0.78_0.16_55)] transition-colors"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {post.title}
                </h2>
                <p className="mt-2 line-clamp-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" style={{ color: GOLD }} />
                    {new Date(post.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  {post.read_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" style={{ color: GOLD }} />
                      {post.read_time} menit
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
