import Link from "next/link"
import { BlogTable } from "./blog-table"
import { BlogSearch } from "./blog-search"

type Post = { id: string; slug: string; title: string; category: string | null; is_published: boolean; published_at: string | null; created_at: string }

export default function AdminBlogContent({ posts, searchQuery }: { posts: Post[]; searchQuery: string }) {
  const filtered = searchQuery 
    ? posts.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : posts

  const published = posts.filter(p => p.is_published).length
  const draft     = posts.length - published

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#111827", margin: 0 }}>Blog</h1>
          <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: 4 }}>
            {posts.length} artikel · {published} published · {draft} draft
          </p>
        </div>
        <Link href="/admin/blog/new"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, height: 40, borderRadius: 999, padding: "0 18px", background: "#D9F25D", color: "#0A0A0A", fontSize: "0.875rem", fontWeight: 700, textDecoration: "none" }}>
          + Buat Artikel
        </Link>
      </div>

      <BlogSearch />

      <BlogTable posts={filtered} />
    </div>
  )
}



