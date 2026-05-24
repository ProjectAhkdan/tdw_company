import Link from "next/link"

const GOLD = "oklch(0.78 0.16 55)"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>404</p>
      <h1 className="mt-4 text-5xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Halaman Tidak Ditemukan</h1>
      <p className="mt-4 text-muted-foreground">Halaman yang Anda cari tidak ada atau telah dipindahkan.</p>
      <Link href="/" className="mt-8 inline-flex h-11 items-center rounded-xl px-8 text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
        Kembali ke Beranda
      </Link>
    </div>
  )
}

