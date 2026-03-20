export type StitchScreen = {
  id: string
  title: string
  slug: string
  route: string
  screenshotPath: string
  htmlPath: string
  kind?: 'screen' | 'design-system'
  notes?: string
}

export const stitchScreens: StitchScreen[] = [
  {
    id: '790d6a658bd4406fa94755b6afe63c8c',
    title: 'Landing Page',
    slug: 'landing-page',
    route: '/',
    screenshotPath: '/stitch/screenshots/landing-page.png',
    htmlPath: '/stitch/html/landing-page.html',
  },
  {
    id: '80c0c337fa5a41afb23bdf6591fc33a2',
    title: 'Evaluation Dashboard',
    slug: 'evaluation-dashboard',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/evaluation-dashboard.png',
    htmlPath: '/stitch/html/evaluation-dashboard.html',
  },
  {
    id: '3f275364986b479aa6e101e8c47bdee1',
    title: 'Evaluation History',
    slug: 'evaluation-history',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/evaluation-history.png',
    htmlPath: '/stitch/html/evaluation-history.html',
  },
  {
    id: 'cf2d856a7eed45bfb7e819e422d05052',
    title: 'Settings',
    slug: 'settings',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/settings.png',
    htmlPath: '/stitch/html/settings.html',
  },
  {
    id: 'b4d5c5591fd2443893be7553cd2822d7',
    title: 'Policy Management',
    slug: 'policy-management',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/policy-management.png',
    htmlPath: '/stitch/html/policy-management.html',
  },
  {
    id: 'cb240a0191cc4100ae72beeaf359f0d5',
    title: 'Help Center',
    slug: 'help-center',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/help-center.png',
    htmlPath: '/stitch/html/help-center.html',
  },
  {
    id: 'b3aeb1961c8c43b6aa841b0bff92cb60',
    title: 'Support Access',
    slug: 'support-access',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/support-access.png',
    htmlPath: '/stitch/html/support-access.html',
  },
  {
    id: '9245c778d5f747f6a750e5c86f1d1f09',
    title: 'Request Service',
    slug: 'request-service',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/request-service.png',
    htmlPath: '/stitch/html/request-service.html',
  },
  {
    id: '139a4308754c4a6894a0a5624d306b36',
    title: 'Add Security Policy Modal',
    slug: 'add-security-policy-modal',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/add-security-policy-modal.png',
    htmlPath: '/stitch/html/add-security-policy-modal.html',
  },
  {
    id: '7ae2e0e1a33e487188c808a0f1525eac',
    title: 'Decision Result',
    slug: 'decision-result',
    route: '/screens',
    screenshotPath: '/stitch/screenshots/decision-result.png',
    htmlPath: '/stitch/html/decision-result.html',
  },
  {
    id: 'asset-stub-assets-639972ffd8e14b96b793edb7c9e2b35e-1773903278731',
    title: 'Design System',
    slug: 'design-system',
    route: '/screens',
    screenshotPath: '',
    htmlPath: '',
    kind: 'design-system',
    notes:
      'Stitch exposed this item as a design-system asset stub, not a normal downloadable screen. See docs/stitch/design-system-spec.md for the preserved source of truth.',
  },
]
