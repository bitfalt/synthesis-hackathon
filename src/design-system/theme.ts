export const aegisTheme = {
  colors: {
    foundation: '#131313',
    shell: '#1c1b1b',
    panel: '#201f1f',
    elevated: '#2a2a2a',
    highest: '#353534',
    primary: '#2DD4BF',
    primaryBright: '#57F1DB',
    secondary: '#60A5FA',
    warning: '#F59E0B',
    text: '#E5E2E1',
    textMuted: '#BACAC5',
    outline: '#3C4A46',
  },
  typography: {
    headline: 'Manrope',
    body: 'Inter',
    label: 'Inter',
  },
  principles: {
    northStar: 'The Sovereign Vault',
    noLineRule:
      'Avoid hard divider lines for layout structure. Prefer tonal shifts, spacing, and glass surfaces.',
    layering:
      'Use dark tonal layers to imply depth, with glass panels and subtle ambient emphasis for high-value actions.',
  },
} as const

export const surfaceStyles = {
  shell: 'surface-shell ghost-outline',
  panel: 'surface-panel ghost-outline',
  elevated: 'surface-elevated ghost-outline',
  glass: 'surface-glass ghost-outline',
} as const
