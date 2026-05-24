export default function AdminLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold animate-pulse"
          style={{ background: "#D9F25D", color: "#0A0A0A" }}>
          TDW
        </div>
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map(delay => (
            <span key={delay} className="inline-block h-1.5 w-1.5 rounded-full animate-bounce"
              style={{ background: "#D9F25D", animationDelay: `${delay}ms` }} />
          ))}
        </div>
        <p className="text-xs text-gray-400">Memuat...</p>
      </div>
    </div>
  )
}

