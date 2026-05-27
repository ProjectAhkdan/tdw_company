export default function ScheduleLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero skeleton */}
      <section className="relative overflow-hidden py-28 px-6 text-center">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-3 w-20 rounded-full bg-muted/30 animate-pulse" />
          <div className="h-12 w-72 rounded-xl bg-muted/30 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-full bg-muted/20 animate-pulse" />
        </div>
      </section>

      {/* Filters skeleton */}
      <div className="sticky top-16 z-30 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-6 py-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-24 shrink-0 rounded-full bg-muted/30 animate-pulse" />
          ))}
        </div>
      </div>

      {/* List skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-6 animate-pulse"
              style={{ opacity: 1 - i * 0.15 }}
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-muted/30" />
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <div className="h-5 w-16 rounded-full bg-muted/30" />
                      <div className="h-5 w-20 rounded-full bg-muted/20" />
                    </div>
                    <div className="h-5 w-48 rounded bg-muted/30" />
                    <div className="flex gap-4">
                      <div className="h-4 w-32 rounded bg-muted/20" />
                      <div className="h-4 w-40 rounded bg-muted/20" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="space-y-2 text-right">
                    <div className="h-7 w-28 rounded bg-muted/30" />
                    <div className="h-5 w-20 rounded-full bg-muted/20" />
                  </div>
                  <div className="h-10 w-20 rounded-xl bg-muted/30" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
