import Link from "next/link"
import { StatNumber } from "./home-interactive"

const L = "#D9F25D"

// ── Section 02: Hero ──────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section className="pt-20 pb-8 px-6" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        {/* Upper: H1 left + desc right */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          {/* H1 */}
          <div>
            <div className="flex items-baseline gap-4">
              <h1 className="text-[clamp(52px,8vw,80px)] font-black leading-none tracking-[-0.02em]" style={{ color: "#FFFFFF" }}>UBAH</h1>
              <h1 className="text-[clamp(52px,8vw,80px)] font-black leading-none tracking-[-0.02em]" style={{ color: L }}>HIDUP</h1>
            </div>
            <h1 className="text-[clamp(52px,8vw,80px)] font-black leading-none tracking-[-0.02em]" style={{ color: L }}>ANDA</h1>
          </div>

          {/* Right col */}
          <div className="max-w-[260px]">
            <p className="text-[13px] leading-[1.6] mb-5" style={{ color: "#8A8A8A" }}>
              Seminar bisnis, properti, dan pengembangan diri terpercaya di Indonesia.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/schedule" className="pill-lime">
                Daftar Sekarang <span className="pill-dot" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "#8A8A8A" }}>
                  10M+
                </div>
                <span className="text-[12px]" style={{ color: "#8A8A8A" }}>peserta</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero photo */}
        <div className="relative mt-8 overflow-hidden rounded-2xl"
          style={{ height: "clamp(200px,35vw,380px)" }}>
          {/* Gambar dengan brightness */}
          <img
            src="/images/hero/bg-homepage-new.webp"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "brightness(1.6)" }}
          />
          {/* Bottom fade — menyatu dengan background */}
          <div className="absolute inset-x-0 bottom-0 h-2/3"
            style={{ background: "linear-gradient(to top, #0A0A0A 0%, #0A0A0A 10%, transparent 100%)" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="select-none text-[clamp(24px,4vw,48px)] font-black tracking-[0.3em]"
              style={{ color: "rgba(255,255,255,0.08)" }}>
              TDW RESOURCES
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 03: Clients ───────────────────────────────────────────────────────
const CLIENTS = [
  "Gapura Prima Group","Gas Negara (PGN)","Muncul Group","Bayer CropScience",
  "Bank BRI","REI","Toyota","Honda","Suzuki","Daihatsu","BatikKeris","Nokia",
  "ERA Real Estate","Hyundai","Jamsostek","Agung Sedayu Group","Telkomsel",
  "Angkasa Pura II","Pertamina","Sun Life Financial","Tiens","Mitsubishi Motors",
  "Adira Finance","Nestle","Sosro","Bank Sinarmas","InHealth","Bappenas",
  "Pos Indonesia","Astra CMG","PT United Tractors","Holcim","Bank Indonesia",
  "Kimia Farma","Allianz","Bridgestone","SCTV","Metro TV","BTPN","PaninBank",
  "Grand Indonesia","BSD City","Milagros","Hino","Sophie Paris","Samsung",
  "Yamaha","LG","BNI","BCA","Unilever","ARA Indonesia","JAPFA","Bakrieland",
  "Mitraio","Nu Skin","Novartis","Prasetya Mulya","Telkom Indonesia","IBM",
  "Takeda","Alfamart",
]

export function LogoBar() {
  return (
    <section className="px-6 py-16" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <p className="section-label mb-3">Our Clients</p>
        <h2 className="text-[clamp(22px,3vw,36px)] font-bold leading-tight text-white mb-10">
          Dipercaya oleh{" "}
          <span style={{ color: L }}>Perusahaan Terkemuka</span>
          <br />di Indonesia &amp; Dunia
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CLIENTS.map((name) => (
            <div key={name}
              className="group flex items-center justify-center rounded-xl px-3 py-4 text-center transition-all duration-200 cursor-default"
              style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span className="text-[11px] font-semibold leading-tight transition-colors duration-200 group-hover:text-[#CECECE]"
                style={{ color: "#5A5A5A" }}>{name}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[12px]" style={{ color: "#3A3A3A" }}>
          60+ perusahaan nasional &amp; internasional telah mempercayakan pengembangan SDM kepada TDW Resources
        </p>
      </div>
    </section>
  )
}

// ── Section 04: About ─────────────────────────────────────────────────────────
export function AboutSection() {
  return (
    <section className="relative px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(100,150,30,0.07) 0%,transparent 70%)", filter: "blur(60px)" }} />
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[1fr_3fr]">
        <p className="section-label">Tentang Kami</p>
        <h2 className="text-[clamp(22px,3vw,32px)] font-normal leading-[1.5]" style={{ color: "#CECECE" }}>
          Kami berdedikasi menciptakan pengalaman seminar yang memadukan{" "}
          <span className="font-bold" style={{ color: L }}>bisnis dan transformasi</span>
        </h2>
      </div>
    </section>
  )
}

// ── Section 05: Stats ─────────────────────────────────────────────────────────
const FALLBACK_STATS = [
  { label: "Berdiri sejak", num: 20, suffix: "+", unit: "Tahun" },
  { label: "Hadir di",      num: 30, suffix: "",  unit: "Negara" },
  { label: "Lebih dari",    num: 10, suffix: "",  unit: "Juta Peserta" },
]

export function StatsSection({ stats = [] }: { stats?: { label: string; value: string }[] }) {
  const items = stats.length
    ? stats.slice(0, 3).map(s => {
        const m = s.value.match(/^(\d+)(\+?)/)
        return { label: s.label, num: m ? parseInt(m[1]) : 0, suffix: m?.[2] ?? "", unit: s.value.replace(/^\d+\+?/, "").trim() || s.label }
      })
    : FALLBACK_STATS
  return (
    <section className="px-6 py-16" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto grid max-w-[1280px] gap-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.5fr]">
        {items.map((s) => (
          <div key={s.unit}>
            <p className="mb-2 text-[12px]" style={{ color: "#5A5A5A" }}>{s.label}</p>
            <p className="text-[clamp(64px,10vw,96px)] font-black leading-none tracking-[-0.03em] text-white">
              <StatNumber value={s.num} suffix={s.suffix} />
              <span style={{ color: L }}>.</span>
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "#5A5A5A" }}>{s.unit}</p>
          </div>
        ))}
        <p className="text-[13px] leading-[1.7] self-center" style={{ color: "#5A5A5A" }}>
          Lebih dari 10 juta orang dari 30 negara telah mengikuti program Success Resources,
          induk perusahaan TDW Resources yang berpusat di Singapore.
        </p>
      </div>
    </section>
  )
}

// ── Section 06: Founder ───────────────────────────────────────────────────────
export function FounderSection() {
  return (
    <section className="relative px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] rounded-full"
        style={{ background: "radial-gradient(circle,rgba(217,242,93,0.04) 0%,transparent 70%)", filter: "blur(80px)" }} />
      <div className="mx-auto max-w-[1280px]">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl opacity-10 blur-3xl" style={{ background: "#D9F25D" }} />
            <div className="relative rounded-2xl p-10 text-center"
              style={{ background: "#141414", border: "1px solid rgba(217,242,93,0.12)" }}>
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl text-2xl font-black"
                style={{ background: "rgba(217,242,93,0.1)", color: L }}>TDW</div>
              <p className="text-xl font-bold text-white">Tung Desem Waringin</p>
              <p className="mt-1 text-sm" style={{ color: "#5A5A5A" }}>Pelatih Sukses No. 1 di Indonesia</p>
              <div className="my-6 h-px w-full" style={{ background: "rgba(217,242,93,0.15)" }} />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-2xl font-black" style={{ color: L }}>10 Juta+</p>
                  <p className="text-xs" style={{ color: "#5A5A5A" }}>Peserta</p>
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: L }}>30+</p>
                  <p className="text-xs" style={{ color: "#5A5A5A" }}>Negara</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5">
            <p className="section-label">Profil Pendiri</p>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold leading-tight text-white">Tung Desem Waringin</h2>
            <p className="text-[14px] leading-[1.8]" style={{ color: "#8A8A8A" }}>
              Tung Desem Waringin adalah Pelatih Sukses No. 1 di Indonesia (Majalah Marketing) dan masuk
              dalam daftar The Most Powerful People and Ideas In Business (Majalah SWA). Beliau juga
              dinobatkan sebagai salah satu dari 30 Tokoh Indonesia yang mempunyai Visi dan Mampu berkarya
              untuk Bangsa dan Negara.
            </p>
            <p className="text-[14px] leading-[1.8]" style={{ color: "#8A8A8A" }}>
              TDW meraih penghargaan MURI untuk penjualan buku terlaris{" "}
              <em className="text-white">&quot;Financial Revolution&quot;</em> yang mencapai 10.511 eksemplar
              di hari pertama secara retail, serta{" "}
              <em className="text-white">&quot;Marketing Revolution&quot;</em> terjual 38.878 eksemplar pada hari pertama edar.
            </p>
            <p className="text-[14px] leading-[1.8]" style={{ color: "#8A8A8A" }}>
              Sebagai co-founder TDW Resources — affiliate dari Success Resources Singapore — beliau telah
              membantu lebih dari 10 juta orang dari 30 negara melalui program pengembangan bisnis dan
              pribadi bertaraf internasional.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 07: Visi & Misi ───────────────────────────────────────────────────
export function VisiMisiSection() {
  return (
    <section className="px-6 py-20" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <p className="section-label mb-3 text-center">Arah Perusahaan</p>
        <h2 className="text-center text-[clamp(28px,4vw,42px)] font-bold text-white mb-12">
          Visi <span style={{ color: L }}>&amp;</span> Misi
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl p-8" style={{ background: "#141414", border: "1px solid rgba(217,242,93,0.1)" }}>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: L }}>Visi</div>
            <h3 className="mb-4 text-lg font-bold text-white">Terbesar, Terbaik &amp; Paling Menguntungkan</h3>
            <ul className="space-y-3 text-[13px] leading-relaxed" style={{ color: "#8A8A8A" }}>
              {["Menjadi Perusahaan Terbesar dalam Bidang Konsultasi, Pelatihan serta Motivasi",
                "Menjadi Perusahaan Terbaik dalam Bidang Konsultasi, Pelatihan serta Motivasi",
                "Perusahaan Paling Menguntungkan: untuk Shareholder, Karyawan, Customer dan Masyarakat",
                "Menjadi Tempat Kerja Paling Menyenangkan (The Happiest Place on the Planet Earth)",
              ].map(v => (
                <li key={v} className="flex gap-2"><span style={{ color: L }}>✦</span>{v}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl p-8" style={{ background: "#141414", border: "1px solid rgba(217,242,93,0.1)" }}>
            <div className="mb-4 text-xs font-bold uppercase tracking-widest" style={{ color: L }}>Misi</div>
            <h3 className="mb-4 text-lg font-bold text-white">Memberdayakan Sumber Daya Manusia</h3>
            <ul className="space-y-3 text-[13px] leading-relaxed" style={{ color: "#8A8A8A" }}>
              {["Menciptakan sumber daya manusia yang memiliki karakter kuat dan berakhlak mulia",
                "Memotivasi karyawan untuk mengembangkan kemampuan inovatif, produktif, serta membentuk karakter tangguh",
              ].map(v => (
                <li key={v} className="flex gap-2"><span style={{ color: L }}>✦</span>{v}</li>
              ))}
            </ul>
            <blockquote className="mt-8 border-l-2 pl-4 text-sm italic"
              style={{ borderColor: L, color: L }}>
              &ldquo;Anda menjadi orang sukses di saat anda mulai bergerak ke arah tujuan yang bermanfaat&rdquo;
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Section 08: Media Coverage ────────────────────────────────────────────────
const MEDIA = [
  "Majalah Pilar Bisnis","Majalah Marketing","Majalah SWA",
  "Jawa Pos Group","Metro TV","SCTV","Majalah Gatra","National Achievers Congress",
]

export function MediaCoverageSection() {
  return (
    <section className="px-6 py-12" style={{ background: "#0A0A0A" }}>
      <div className="mx-auto max-w-[1280px]">
        <p className="mb-8 text-center text-[11px] font-medium uppercase tracking-widest" style={{ color: "#3A3A3A" }}>
          Diliput &amp; Diakui Oleh
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8">
          {MEDIA.map((name, i) => (
            <span key={name} className="flex items-center gap-8">
              {i > 0 && <span style={{ color: "#2A2A2A" }}>●</span>}
              <span className="text-[14px] font-semibold transition-colors cursor-default hover:text-white"
                style={{ color: "#3A3A3A" }}>{name}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}


