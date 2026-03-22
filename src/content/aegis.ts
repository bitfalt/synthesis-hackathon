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

export const demoEvaluationDraft = {
  treasuryPolicy: `Treasury must preserve at least 18 months of stable reserve runway.\nAny transfer above 400 ETH requires signer review.\nBlocked categories include unapproved bridges, unverified OTC brokers, and sanctioned counterparties.\nETH concentration should remain below 50% of total treasury value.`,
  treasuryState: `Stable reserve runway: 22 months.\nETH concentration after the proposed transfer: 47%.\nNo active emergency override.\nDestination category is strategic ecosystem liquidity.`,
  proposedAction: `Transfer 450 ETH from treasury reserves to a Base ecosystem market-making program in order to deepen protocol liquidity while keeping stablecoin runway intact.`,
}

export const guardrailCheckBlueprints = [
  {
    name: 'Runway Preservation',
    detail: 'Treasury state is checked against the minimum reserve runway floor before a recommendation is returned.',
  },
  {
    name: 'Single Transfer Threshold',
    detail: 'Large transfers escalate to signer review even when hard-stop policy rules are not breached.',
  },
  {
    name: 'Asset Concentration',
    detail: 'Aegis checks whether the resulting portfolio concentration remains inside the configured policy band.',
  },
  {
    name: 'Counterparty Category Policy',
    detail: 'Blocked or sensitive destination categories are caught before any public-safe summary is produced.',
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
