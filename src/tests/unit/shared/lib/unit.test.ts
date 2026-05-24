import { describe, it, expect } from 'vitest'
import { sanitizeText, sanitizeInput } from '@/shared/lib/sanitize'
import { rateLimit } from '@/shared/lib/rate-limit'

import { formatDate, formatCurrency } from '@/shared/lib/i18n'

// ── sanitize ─────────────────────────────────────────────────────────────────
describe('sanitizeText', () => {
  it('strips script tags with content', () => {
    expect(sanitizeText('<script>alert(1)</script>hello')).toBe('hello')
  })
  it('strips HTML tags leaving text', () => {
    expect(sanitizeText('<b>hello</b> world')).toBe('hello world')
  })
  it('trims whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })
  it('truncates at 10000 chars', () => {
    expect(sanitizeText('a'.repeat(20000)).length).toBe(10000)
  })
})

describe('sanitizeInput', () => {
  it('sanitizes string values in object', () => {
    const result = sanitizeInput({ name: '<b>John</b>', age: 30 })
    expect(result.name).toBe('John')
    expect(result.age).toBe(30)
  })
})

// ── rate-limit ────────────────────────────────────────────────────────────────
describe('rateLimit', () => {
  it('allows requests within limit', async () => {
    const { ok } = await rateLimit('test-user-1', 'test-action', 3, 60)
    expect(ok).toBe(true)
  })
  it('blocks after limit exceeded', async () => {
    const id = 'test-user-block'
    await rateLimit(id, 'block-test', 2, 60)
    await rateLimit(id, 'block-test', 2, 60)
    const { ok } = await rateLimit(id, 'block-test', 2, 60)
    expect(ok).toBe(false)
  })
  it('returns correct remaining count', async () => {
    const id = 'test-user-remaining'
    const { remaining } = await rateLimit(id, 'remaining-test', 5, 60)
    expect(remaining).toBe(4)
  })
})


// ── i18n formatters ───────────────────────────────────────────────────────────
describe('formatDate', () => {
  it('formats date in Indonesian', () => {
    const result = formatDate('2026-06-15', { day: 'numeric', month: 'long', year: 'numeric' })
    expect(result).toContain('2026')
    expect(result).toContain('Juni')
  })
})

describe('formatCurrency', () => {
  it('formats IDR in Indonesian locale', () => {
    const result = formatCurrency(2500000)
    expect(result).toContain('2.500.000')
  })
})

