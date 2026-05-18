export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center"
      style={{ background: "oklch(0.08 0.005 260)" }}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold animate-pulse"
          style={{ background: "oklch(0.78 0.16 55)", color: "oklch(0.08 0 0)" }}>
          TDW
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map(delay => (
            <span key={delay} className="inline-block h-1.5 w-1.5 rounded-full animate-bounce"
              style={{ background: "oklch(0.78 0.16 55)", animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
