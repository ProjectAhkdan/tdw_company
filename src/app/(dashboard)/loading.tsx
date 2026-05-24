const GOLD = "#D9F25D"

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center"
      style={{ background: "oklch(0.08 0.005 260)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold animate-pulse"
          style={{ background: GOLD, color: "#0A0A0A" }}>
          TDW
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map(delay => (
            <span key={delay} className="inline-block h-1.5 w-1.5 rounded-full animate-bounce"
              style={{ background: GOLD, animationDelay: `${delay}ms` }} />
          ))}
        </div>
        <p className="text-xs" style={{ color: "oklch(0.45 0.01 60)" }}>Memuat Dashboard...</p>
      </div>
    </div>
  )
}
