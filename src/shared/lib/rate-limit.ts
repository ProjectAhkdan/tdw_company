/**
 * Simple in-memory rate limiter.
 * For production with multiple instances, replace with Upstash Redis.
 * Usage: const ok = rateLimit(ip, 'checkout', 5, 60) // 5 req/min
 */

const store = new Map<string, { count: number; reset: number }>()

export function rateLimit(
  identifier: string,
  action: string,
  limit: number,
  windowSeconds: number
): { ok: boolean; remaining: number } {
  const key = `${action}:${identifier}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowSeconds * 1000 })
    return { ok: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0 }
  }

  entry.count++
  return { ok: true, remaining: limit - entry.count }
}

// Cleanup old entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of store.entries()) {
      if (now > val.reset) store.delete(key)
    }
  }, 5 * 60 * 1000)
}
