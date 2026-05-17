"use client"

const GOLD = "oklch(0.78 0.16 55)"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium uppercase tracking-widest" style={{ color: GOLD }}>Error</p>
      <h2 className="mt-4 text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>Terjadi Kesalahan</h2>
      <p className="mt-3 text-muted-foreground">Gagal memuat halaman. Silakan coba lagi.</p>
      <button onClick={reset} className="mt-6 h-10 rounded-xl px-6 text-sm font-semibold transition-all hover:opacity-90"
        style={{ background: GOLD, color: "oklch(0.08 0 0)" }}>
        Coba Lagi
      </button>
    </div>
  )
}
