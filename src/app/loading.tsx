export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
      style={{ background: "oklch(0.08 0.005 260)" }}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold animate-pulse"
        style={{ background: "oklch(0.78 0.16 55)", color: "oklch(0.08 0 0)" }}>
        TDW
      </div>
      <div className="flex items-center gap-2 text-sm" style={{ color: "oklch(0.55 0.01 60)" }}>
        <span className="inline-block h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "oklch(0.78 0.16 55)", animationDelay: "0ms" }} />
        <span className="inline-block h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "oklch(0.78 0.16 55)", animationDelay: "150ms" }} />
        <span className="inline-block h-1.5 w-1.5 rounded-full animate-bounce" style={{ background: "oklch(0.78 0.16 55)", animationDelay: "300ms" }} />
      </div>
    </div>
  )
}

