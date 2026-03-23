export type StitchScreen = {
  id: string
  title: string
  slug: string
  route: string
  screenshotPath: string
  htmlPath: string
  status?: 'Live MVP' | 'Supporting surface' | 'Demo-grade artifact surface'
  kind?: 'screen' | 'design-system'
  notes?: string
  judgeNote?: string
}

export const stitchScreens: StitchScreen[] = [
  {
    id: '790d6a658bd4406fa94755b6afe63c8c',
    title: 'Landing Page',
    slug: 'landing-page',
    route: '/',
    screenshotPath: '/stitch/screenshots/landing-page.png',
    htmlPath: '/stitch/html/landing-page.html',
    status: 'Supporting surface',
    judgeNote: 'Use this route for framing, then jump into /evaluation-dashboard for the real demo loop.',
  },
  {
    id: '80c0c337fa5a41afb23bdf6591fc33a2',
    title: 'Evaluation Dashboard',
    slug: 'evaluation-dashboard',
    route: '/evaluation-dashboard',
    screenshotPath: '/stitch/screenshots/evaluation-dashboard.png',
    htmlPath: '/stitch/html/evaluation-dashboard.html',
    status: 'Live MVP',
    judgeNote: 'Start here, submit one evaluation, and continue into /decision-result.',
  },
  {
    id: '3f275364986b479aa6e101e8c47bdee1',
    title: 'Evaluation History',
    slug: 'evaluation-history',
    route: '/evaluation-history',
    screenshotPath: '/stitch/screenshots/evaluation-history.png',
    htmlPath: '/stitch/html/evaluation-history.html',
    status: 'Live MVP',
    judgeNote: 'Confirms that completed evaluations, receipt IDs, and persisted records survive the initial run.',
  },
  {
    id: 'cf2d856a7eed45bfb7e819e422d05052',
    title: 'Settings',
    slug: 'settings',
    route: '/settings',
    screenshotPath: '/stitch/screenshots/settings.png',
    htmlPath: '/stitch/html/settings.html',
    status: 'Supporting surface',
    judgeNote: 'Useful for runtime disclosures, but many controls remain non-persistent preview UI.',
  },
  {
    id: 'b4d5c5591fd2443893be7553cd2822d7',
    title: 'Policy Management',
    slug: 'policy-management',
    route: '/policy-management',
    screenshotPath: '/stitch/screenshots/policy-management.png',
    htmlPath: '/stitch/html/policy-management.html',
    status: 'Supporting surface',
    judgeNote: 'Real structured policy CRUD exists here, but it is not required for the fastest 2-minute judge flow.',
  },
  {
    id: 'cb240a0191cc4100ae72beeaf359f0d5',
    title: 'Help Center',
    slug: 'help-center',
    route: '/help-center',
    screenshotPath: '/stitch/screenshots/help-center.png',
    htmlPath: '/stitch/html/help-center.html',
    status: 'Supporting surface',
    judgeNote: 'Acts as a review hub that links judges to the live trust surfaces and MVP routes.',
  },
  {
    id: 'b3aeb1961c8c43b6aa841b0bff92cb60',
    title: 'Support Access',
    slug: 'support-access',
    route: '/support-access',
    screenshotPath: '/stitch/screenshots/support-access.png',
    htmlPath: '/stitch/html/support-access.html',
    status: 'Demo-grade artifact surface',
    judgeNote: 'UI-only concierge mock preserved from Stitch. No live messaging or ticket workflow is wired.',
  },
  {
    id: '9245c778d5f747f6a750e5c86f1d1f09',
    title: 'Request Service',
    slug: 'request-service',
    route: '/request-service',
    screenshotPath: '/stitch/screenshots/request-service.png',
    htmlPath: '/stitch/html/request-service.html',
    status: 'Demo-grade artifact surface',
    judgeNote: 'Presentational intake preview only. No service request submission pipeline is connected.',
  },
  {
    id: '139a4308754c4a6894a0a5624d306b36',
    title: 'Add Security Policy Modal',
    slug: 'add-security-policy-modal',
    route: '/add-security-policy-modal',
    screenshotPath: '/stitch/screenshots/add-security-policy-modal.png',
    htmlPath: '/stitch/html/add-security-policy-modal.html',
    status: 'Supporting surface',
    judgeNote: 'Alternate route that opens the real policy form in modal mode for reference and QA.',
  },
  {
    id: '7ae2e0e1a33e487188c808a0f1525eac',
    title: 'Decision Result',
    slug: 'decision-result',
    route: '/decision-result',
    screenshotPath: '/stitch/screenshots/decision-result.png',
    htmlPath: '/stitch/html/decision-result.html',
    status: 'Live MVP',
    judgeNote: 'Shows the decision, provider provenance, receipt JSON link, and agent log JSON link for the submitted evaluation.',
  },
  {
    id: 'asset-stub-assets-639972ffd8e14b96b793edb7c9e2b35e-1773903278731',
    title: 'Design System',
    slug: 'design-system',
    route: '/screens',
    screenshotPath: '',
    htmlPath: '',
    status: 'Supporting surface',
    kind: 'design-system',
    notes:
      'Stitch exposed this item as a design-system asset stub, not a normal downloadable screen. The canonical implementation guide lives in src/design-system/README.md.',
    judgeNote: 'Reference asset only. It helps judges map the preserved Stitch exports to the routed app.',
  },
]
