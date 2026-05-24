import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// In-memory fallback (local dev / missing env vars)
const store = new Map<string, { count: number; reset: number }>()

function inMemoryRateLimit(
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
  if (entry.count >= limit) return { ok: false, remaining: 0 }
  entry.count++
  return { ok: true, remaining: limit - entry.count }
}

// Cleanup in-memory store every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of store.entries()) {
      if (now > val.reset) store.delete(key)
    }
  }, 5 * 60 * 1000)
}

// Upstash Redis client — only if env vars are present
const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null

export async function rateLimit(
  identifier: string,
  action: string,
  limit: number,
  windowSeconds: number
): Promise<{ ok: boolean; remaining: number }> {
  if (!redis) {
    return inMemoryRateLimit(identifier, action, limit, windowSeconds)
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
    prefix: `rl:${action}`,
  })

  const { success, remaining } = await limiter.limit(identifier)
  return { ok: success, remaining }
}


