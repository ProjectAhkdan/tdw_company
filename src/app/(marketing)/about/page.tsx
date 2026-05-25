import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getCompanyStats, getTeamMembers, getMediaCoverage } from "@/infrastructure/storage/supabase-queries"

const GOLD = "#D9F25D"

const FALLBACK_STATS = [
  { id: "1", label: "Peserta", value: "10 Juta+", sort_order: 0 },
  { id: "2", label: "Negara", value: "30+", sort_order: 1 },
  { id: "3", label: "Tahun Pengalaman", value: "20+", sort_order: 2 },
  { id: "4", label: "Program Training", value: "7+", sort_order: 3 },
]
const FALLBACK_MEDIA = [
  { id: "1", name: "Majalah Pilar Bisnis",  logo_url: null, sort_order: 0 },
  { id: "2", name: "Majalah Marketing",     logo_url: null, sort_order: 1 },
  { id: "3", name: "Majalah SWA",           logo_url: null, sort_order: 2 },
  { id: "4", name: "Jawa Pos Group",        logo_url: null, sort_order: 3 },
  { id: "5", name: "Metro TV",              logo_url: null, sort_order: 4 },
  { id: "6", name: "SCTV",                  logo_url: null, sort_order: 5 },
  { id: "7", name: "Majalah Gatra",         logo_url: null, sort_order: 6 },
]

export default async function AboutPage() {
  const [statsRes, teamRes, mediaRes] = await Promise.all([
    getCompanyStats(),
    getTeamMembers(),
    getMediaCoverage(),
  ])

  const stats = statsRes.data?.length ? statsRes.data : FALLBACK_STATS
  const media = mediaRes.data?.length ? mediaRes.data : FALLBACK_MEDIA
  const team = teamRes.data ?? []

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32 px-6 text-center">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full opacity-[0.10] blur-[100px]"
            style={{ background: GOLD }} />
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(#D9F25D 1px, transparent 1px), linear-gradient(90deg, #D9F25D 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
          <div className="mb-4 text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Tentang Kami
          </div>
          <h1 className="text-5xl font-bold leading-tight sm:text-6xl" style={{ fontFamily: "'Playfair Display', serif" }}>
            TDW Resources
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Affiliate dari Success Resources Singapore. Perusahaan Event Organizer dan seminar pendidikan yang didirikan oleh Mr. Richard Tan dan Mr. Tung Desem Waringin. Lebih dari 10 juta orang dari 30 negara telah mengikuti program kami.
          </p>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.id} className="glass rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold" style={{ color: GOLD, fontFamily: "'Playfair Display', serif" }}>{s.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROFIL TDW ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Visual */}
            <div className="relative mx-auto w-full max-w-sm lg:mx-0">
              <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{ background: GOLD }} />
              <div className="relative glass rounded-3xl p-10 text-center"
                style={{ border: `1px solid ${GOLD}30` }}>
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl text-2xl font-bold"
                  style={{ background: `${GOLD}20`, color: GOLD, fontFamily: "'Playfair Display', serif" }}>
                  TDW
                </div>
                <p className="text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Tung Desem Waringin</p>
                <p className="mt-1 text-sm text-muted-foreground">Pelatih Sukses No. 1 di Indonesia</p>
                <div className="mt-6 divider-gold" />
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold" style={{ color: GOLD }}>10 Juta+</p>
                    <p className="text-xs text-muted-foreground">Peserta</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: GOLD }}>30+</p>
                    <p className="text-xs text-muted-foreground">Negara</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-5">
              <div className="text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
                Profil Pendiri
              </div>
              <h2 className="text-4xl font-bold leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Tung Desem Waringin
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Tung Desem Waringin adalah Pelatih Sukses No. 1 di Indonesia (Majalah Marketing) dan masuk dalam daftar The Most Powerful People and Ideas In Business (Majalah SWA). Beliau juga dinobatkan sebagai salah satu dari 30 Tokoh Indonesia yang mempunyai Visi dan Mampu berkarya untuk Bangsa dan Negara.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                TDW meraih penghargaan MURI untuk penjualan buku terlaris <em className="text-foreground">&quot;Financial Revolution&quot;</em> yang mencapai 10.511 eksemplar di hari pertama secara retail, serta buku <em className="text-foreground">&quot;Marketing Revolution&quot;</em> yang terjual 38.878 eksemplar pada hari pertama edar. Peluncuran bukunya diliput oleh 125 media cetak, elektronik, nasional dan internasional di 5 benua: Asia, Afrika, Australia, Eropa, dan Amerika.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Sebagai co-founder TDW Resources — affiliate dari Success Resources Singapore — beliau telah membantu lebih dari 10 juta orang dari 30 negara melalui program-program pengembangan bisnis dan pribadi bertaraf internasional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VISI & MISI ──────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
            Arah Perusahaan
          </div>
          <h2 className="text-center text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Visi & Misi
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${GOLD}25` }}>
              <div className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color: GOLD }}>Visi</div>
              <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Terbesar, Terbaik & Paling Menguntungkan
              </h3>
              <ul className="space-y-2 text-muted-foreground leading-relaxed">
                <li>• Menjadi Perusahaan yang Terbesar dalam Bidang Konsultasi, Pelatihan serta Motivasi</li>
                <li>• Menjadi Perusahaan yang Terbaik dalam Bidang Konsultasi, Pelatihan serta Motivasi</li>
                <li>• Perusahaan Paling Menguntungkan: untuk Shareholder, Karyawan, Customer dan Masyarakat</li>
                <li>• Menjadi Perusahaan sebagai Tempat Kerja yang Paling Menyenangkan (The Happiest Place on the Planet Earth)</li>
              </ul>
            </div>
            <div className="glass rounded-2xl p-8" style={{ border: `1px solid ${GOLD}25` }}>
              <div className="mb-4 text-sm font-bold uppercase tracking-widest" style={{ color: GOLD }}>Misi</div>
              <h3 className="mb-3 text-xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Memberdayakan Sumber Daya Manusia
              </h3>
              <ul className="space-y-2 text-muted-foreground leading-relaxed">
                <li>• Menciptakan sumber daya manusia yang memiliki karakter kuat dan berakhlak mulia</li>
                <li>• Memotivasi karyawan untuk mengembangkan kemampuan inovatif, produktif, serta membentuk karakter tangguh</li>
              </ul>
              <blockquote className="mt-6 border-l-2 pl-4 italic text-sm" style={{ borderColor: GOLD, color: GOLD }}>
                &ldquo;Anda menjadi orang sukses di saat anda mulai bergerak ke arah tujuan yang bermanfaat&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM (jika ada data) ──────────────────────────────────────────── */}
      {team.length > 0 && (
        <section className="py-20 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="mb-4 text-center text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>
              Tim Kami
            </div>
            <h2 className="text-center text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Orang-Orang di Balik TDW
            </h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => (
                <div key={member.id} className="glass glass-hover group rounded-2xl p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${GOLD}20`, color: GOLD }}>
                    {member.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: GOLD }}>{member.role}</p>
                  {member.bio && <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── MEDIA COVERAGE ───────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <p className="mb-8 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Diliput & Diakui Oleh
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {media.map((m) => (
              <span key={m.id} className="text-lg font-semibold text-muted-foreground/50 transition-colors hover:text-muted-foreground">
                {m.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 text-center">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[100px]"
            style={{ background: GOLD }} />
        </div>
        <div className="relative z-10 mx-auto max-w-xl">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Bergabunglah Bersama Kami
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Mulai perjalanan transformasi Anda bersama TDW Resources dan raih potensi terbaik dalam hidup Anda.
          </p>
          <Link href="/seminars"
            className="mt-8 inline-flex items-center gap-2 rounded-xl px-8 py-3.5 font-semibold transition-all duration-200 hover:scale-[1.02]"
            style={{ background: GOLD, color: "#0A0A0A", boxShadow: `0 0 30px ${GOLD}35` }}>
            Lihat Seminar <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}


