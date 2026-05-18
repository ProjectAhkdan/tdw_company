export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24 animate-pulse">
      <div className="mb-4 h-4 w-24 rounded bg-muted/30 mx-auto" />
      <div className="mb-3 h-10 w-64 rounded bg-muted/40 mx-auto" />
      <div className="mb-16 h-4 w-48 rounded bg-muted/30 mx-auto" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "oklch(0.11 0.008 55 / 0.6)" }}>
            <div className="h-44 bg-muted/30" />
            <div className="p-5 space-y-3">
              <div className="h-4 w-3/4 rounded bg-muted/40" />
              <div className="h-3 w-full rounded bg-muted/30" />
              <div className="h-3 w-2/3 rounded bg-muted/30" />
              <div className="h-6 w-28 rounded bg-muted/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
