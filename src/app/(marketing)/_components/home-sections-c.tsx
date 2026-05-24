import Link from "next/link"

const L = "#D9F25D"

// ── Section 11: Team ──────────────────────────────────────────────────────────
const TEAM = [
  { name: "Richard Tan", role: "Co-Founder" },
  { name: "Tung Desem Waringin", role: "Co-Founder & Trainer" },
  { name: "Tim Marketing", role: "Marketing Team" },
  { name: "Tim Operasional", role: "Operations" },
  { name: "Tim Support", role: "Customer Support" },
]

export function TeamSection() {
  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        {/* Hero team photo placeholder */}
        <div className="relative mb-12 overflow-hidden rounded-2xl"
          style={{ height: "280px", background: "linear-gradient(135deg,#111 0%,#1a1a0a 100%)" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/60 via-transparent to-[#0A0A0A]/60" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <span className="rounded-full px-6 py-2 text-sm font-bold"
              style={{ background: L, color: "#0A0A0A" }}>
              Seminar terpercaya di Indonesia
            </span>
          </div>
        </div>

        {/* Heading + divider */}
        <div className="mb-10 flex items-center gap-6">
          <h2 className="shrink-0 text-[28px] font-bold text-white">
            Tim di balik<br />layar
          </h2>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {TEAM.map((m) => (
            <div key={m.name} className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full text-xl font-bold"
                style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.08)", color: L }}>
                {m.name.charAt(0)}
              </div>
              <p className="text-[14px] font-semibold text-white">{m.name}</p>
              <p className="text-[12px]" style={{ color: "#5A5A5A" }}>{m.role}</p>
            </div>
          ))}
          {/* Badge item */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full font-black"
              style={{ background: L, color: "#0A0A0A" }}>
              <span className="text-3xl">10+</span>
              <span className="text-[10px] font-semibold">Tim</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 12: Have a project? CTA ──────────────────────────────────────────
export function CtaMidSection() {
  return (
    <section className="relative overflow-hidden px-6 py-24" style={{ background: "#0A0A0A" }}>
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(100,150,30,0.07) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="mx-auto max-w-[1280px]">
        <p className="section-label mb-6">Bergabung</p>
        <h2 className="text-[clamp(32px,5vw,56px)] font-black leading-tight text-white">
          ingin bergabung?<br />daftar sekarang
        </h2>

        <div className="mt-10 flex items-center gap-8">
          <div>
            <p className="text-[24px] font-bold text-white">10 Juta+</p>
            <p className="text-[11px]" style={{ color: "#5A5A5A" }}>Alumni</p>
          </div>
          <span style={{ color: "#3A3A3A" }}>·</span>
          <div>
            <p className="text-[24px] font-bold text-white">30+</p>
            <p className="text-[11px]" style={{ color: "#5A5A5A" }}>Negara</p>
          </div>
        </div>

        <Link href="/register" className="pill-lime mt-8 inline-flex">
          Daftar Sekarang <span className="pill-dot" />
        </Link>
      </div>
    </section>
  )
}

// ── Section 13: Blog ──────────────────────────────────────────────────────────
type BlogPost = {
  id: string
  title: string
  slug: string
  category?: string
  published_at?: string | null
  thumbnail_url?: string | null
}

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  const items = posts.slice(0, 3)
  if (!items.length) return null

  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        {/* Heading row */}
        <div className="mb-10 flex items-end gap-6">
          <div>
            <p className="section-label mb-3">Articles</p>
            <h2 className="text-[clamp(22px,3vw,32px)] font-bold text-white">
              Berita & artikel<br />terbaru kami
            </h2>
          </div>
          <div className="mb-2 h-px flex-1" style={{ background: "rgba(255,255,255,0.08)" }} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} href={`/blog/${p.slug}`}
              className="overflow-hidden rounded-xl transition-all duration-200 hover:-translate-y-1"
              style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)" }}>
              {/* Thumbnail */}
              <div className="aspect-video w-full overflow-hidden"
                style={{ background: p.thumbnail_url ? undefined : "#1A1A1A" }}>
                {p.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.thumbnail_url} alt={p.title} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2 text-[11px]">
                  {p.category && <span style={{ color: L }}>{p.category}</span>}
                  {p.category && p.published_at && <span style={{ color: "#3A3A3A" }}>·</span>}
                  {p.published_at && (
                    <span style={{ color: "#5A5A5A" }}>
                      {new Date(p.published_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  )}
                </div>
                <h3 className="line-clamp-2 text-[15px] font-semibold text-white">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

