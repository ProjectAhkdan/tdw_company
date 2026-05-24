export const BRAND = {
  // Marketing/dashboard theme (dark)
  LIME:        '#D9F25D',
  LIME_DARK:   '#0A0A0A',
  // Admin theme (light)
  ORANGE:      'oklch(0.72 0.18 55)',
  ORANGE_BG:   'oklch(0.97 0.04 60)',
  ORANGE_TEXT: 'oklch(0.45 0.15 50)',
  ORANGE_DARK: '#1a0a00',
  // Semantic
  SUCCESS:     '#10B981',
  ERROR:       '#EF4444',
  INFO:        '#3B82F6',
  WARNING:     '#F59E0B',
} as const

export type BrandColor = typeof BRAND[keyof typeof BRAND]
