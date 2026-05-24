"use client"
export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <p className="text-muted-foreground">Gagal memuat data.</p>
      <button onClick={reset} className="mt-4 rounded-xl px-5 py-2 text-sm font-medium"
        style={{ background: "#D9F25D", color: "#0A0A0A" }}>Coba Lagi</button>
    </div>
  )
}
