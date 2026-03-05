import type { TasteProfile } from './types'

export const TASTE_PROFILE: TasteProfile = {
  principles: {
    identity:
      'Utilitarian, dark, precise. Military-industrial clarity with selective warmth.',
    themes: [
      'dark-first',
      'high-contrast-data',
      'monospace-for-information',
      'selective-accent-color',
    ],
    values: [
      'clarity-over-decoration',
      'density-over-whitespace',
      'function-drives-form',
      'sharp-geometry',
    ],
  },
  palette: {
    base: {
      background: '#0a0a0a',
      surface: '#141414',
      text: '#fafafa',
    },
    accents: {
      primary: '#eab308',
      armed: '#f97316',
      ai: '#a855f7',
      success: '#22c55e',
      destructive: '#dc2626',
      info: '#3b82f6',
    },
    rules: [
      'accent-colors-are-semantic-not-decorative',
      'never-use-gradients',
      'contrast-ratio-minimum-4.5',
    ],
  },
  typography: {
    fonts: {
      data: 'DM Mono',
      ui: 'DM Sans',
    },
    rules: [
      'monospace-for-data-and-metrics',
      'sans-serif-for-navigation-and-labels',
      'no-serif-fonts',
      'weight-contrast-for-hierarchy',
    ],
  },
  spacing: {
    density: 'high',
    borderRadius: '0.5rem',
    rules: [
      'prefer-density-over-whitespace',
      'consistent-gap-rhythm',
      'breathing-room-between-sections-not-within',
    ],
  },
  antiPatterns: [
    'gradients',
    'light-theme-defaults',
    'decorative-rounded-corners',
    'skeleton-loaders-that-flash',
    'placeholder-stock-imagery',
    'emoji-in-professional-ui',
    'low-contrast-muted-text',
  ],
} as const
