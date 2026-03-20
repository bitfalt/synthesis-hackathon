export const primaryTracks = [
  {
    name: 'Agents With Receipts — ERC-8004',
    description:
      'Trusted agent identity, manifests, receipts, and verifiable treasury decision logs.',
  },
  {
    name: 'Private Agents, Trusted Actions — Venice',
    description:
      'Private reasoning over treasury policy, with public-safe outputs that do not leak sensitive constraints.',
  },
  {
    name: 'Agent Services on Base',
    description:
      'Aegis is framed as a callable treasury decision service, not just an internal dashboard.',
  },
] as const

export const consoleNav = [
  { label: 'Dashboard', to: '/evaluation-dashboard', icon: 'dashboard' },
  { label: 'Policy Management', to: '/policy-management', icon: 'gavel' },
  { label: 'Evaluation History', to: '/evaluation-history', icon: 'history' },
  { label: 'Decision Result', to: '/decision-result', icon: 'fact_check' },
  { label: 'Request Service', to: '/request-service', icon: 'bolt' },
  { label: 'Support Access', to: '/support-access', icon: 'support_agent' },
  { label: 'Settings', to: '/settings', icon: 'settings' },
  { label: 'Help Center', to: '/help-center', icon: 'help' },
] as const

export const treasuryMetrics = [
  {
    label: 'Total Value Reviewed',
    value: '$42.89M',
    tone: 'primary' as const,
    helper: '+2.4% from last epoch',
    icon: 'trending_up',
  },
  {
    label: 'Active Guardrails',
    value: '12',
    tone: 'neutral' as const,
    helper: '100% health status',
    icon: 'verified_user',
  },
  {
    label: 'Risk Exposure',
    value: 'Low',
    tone: 'warning' as const,
    helper: 'No active policy violations',
    icon: 'gpp_maybe',
  },
] as const

export const proposedAction = {
  amount: '450.00 ETH',
  asset: 'Wrapped Ethereum (WETH)',
  destination: 'Base ecosystem market-making program',
  reason: 'Fund a strategic liquidity expansion while preserving stablecoin runway and reserve concentration guardrails.',
}

export const guardrailChecks = [
  {
    name: 'Runway Preservation',
    result: 'pass' as const,
    detail: 'Stable reserve runway remains above the 18-month floor after settlement.',
  },
  {
    name: 'Single Transfer Threshold',
    result: 'review' as const,
    detail: 'The request crosses the 400 ETH review threshold and requires signer acknowledgement.',
  },
  {
    name: 'Asset Concentration',
    result: 'pass' as const,
    detail: 'Post-transfer ETH concentration remains within the configured guardrail band.',
  },
  {
    name: 'Counterparty Category Policy',
    result: 'pass' as const,
    detail: 'Destination category is approved for strategic ecosystem liquidity programs.',
  },
] as const

export const evaluationHistory = [
  {
    id: 'EV-2048',
    title: 'Liquidity allocation review',
    decision: 'WARN',
    timestamp: '2026-03-20 01:11 UTC',
    asset: '450.00 ETH',
    summary: 'Approved for manual review after threshold escalation.',
  },
  {
    id: 'EV-2047',
    title: 'Vendor payment settlement',
    decision: 'ALLOW',
    timestamp: '2026-03-19 19:42 UTC',
    asset: '250,000 USDC',
    summary: 'Payment fell within approved operational spend bands.',
  },
  {
    id: 'EV-2046',
    title: 'Treasury strategy migration',
    decision: 'BLOCK',
    timestamp: '2026-03-19 16:08 UTC',
    asset: '1.2M USDC',
    summary: 'Blocked due to reserve floor breach and missing override receipt.',
  },
] as const

export const policies = [
  {
    id: 'POL-01',
    name: 'Runway Floor',
    status: 'active' as const,
    summary: 'Treasury must preserve at least 18 months of stable reserve runway.',
  },
  {
    id: 'POL-02',
    name: 'Single Transfer Review',
    status: 'review' as const,
    summary: 'Any transfer above 400 ETH must escalate for manual confirmation.',
  },
  {
    id: 'POL-03',
    name: 'Counterparty Restrictions',
    status: 'active' as const,
    summary: 'Blocked categories include unverified OTC brokers and unapproved bridges.',
  },
  {
    id: 'POL-04',
    name: 'Emergency Override',
    status: 'draft' as const,
    summary: 'Dual-signature override flow for crisis mitigation and circuit breakers.',
  },
] as const

export const supportServices = [
  {
    name: 'Advanced Evaluation',
    icon: 'analytics',
    description: 'Deep-dive risk analysis for strategic treasury actions and ecosystem allocations.',
  },
  {
    name: 'Policy Development',
    icon: 'architecture',
    description: 'Design and refine multi-sig, reserve, and approval guardrail frameworks.',
  },
  {
    name: 'White-Glove Onboarding',
    icon: 'front_hand',
    description: 'Guided treasury migration and operational rollout support for new teams.',
  },
  {
    name: 'Vault Audit',
    icon: 'security_update_good',
    description: 'Comprehensive review of current treasury controls and decision surfaces.',
  },
] as const

export const faqs = [
  {
    question: 'Does Aegis expose our private treasury policy?',
    answer:
      'No. The product is designed to separate private reasoning from public-safe outputs, so the external recommendation does not need to reveal confidential internal constraints.',
  },
  {
    question: 'What does the ERC-8004 layer actually do here?',
    answer:
      'It anchors the trust story: identity, manifests, receipts, and reviewable logs that make agent outputs more credible and auditable.',
  },
  {
    question: 'Why is this framed as a service on Base?',
    answer:
      'Because the product should feel like a callable treasury decision service, not just a static analytics dashboard. Base is the distribution and service layer.',
  },
] as const
