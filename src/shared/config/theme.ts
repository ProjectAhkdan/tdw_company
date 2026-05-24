export const BRAND = {
  // Marketing/dashboard theme (dark)
  LIME:        '#D9F25D',
  LIME_DARK:   '#0A0A0A',
  // Admin theme (light)
  ORANGE:      '#D9F25D',
  ORANGE_BG:   'rgba(217,242,93,0.12)',
  ORANGE_TEXT: '#0A0A0A',
  ORANGE_DARK: '#0A0A0A',
  // Semantic
  SUCCESS:     '#10B981',
  ERROR:       '#EF4444',
  INFO:        '#3B82F6',
  WARNING:     '#F59E0B',
} as const

export type BrandColor = typeof BRAND[keyof typeof BRAND]

