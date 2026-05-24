/** Strip HTML tags and dangerous characters from user input */
export function sanitizeText(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script tags with content
    .replace(/<[^>]*>/g, '')           // strip remaining HTML tags
    .replace(/["'`]/g, '')             // strip quote chars
    .trim()
    .slice(0, 10000)
}

/** Sanitize for use in DB queries (extra safety on top of parameterized queries) */
export function sanitizeInput<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeText(value)
    } else {
      result[key] = value
    }
  }
  return result as T
}

