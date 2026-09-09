import { z } from 'zod'

export const policyStatuses = ['draft', 'active', 'archived'] as const
export type PolicyStatus = (typeof policyStatuses)[number]

export const policyRuleTypes = [
  'runway_months_min',
  'eth_review_threshold',
  'stable_review_threshold',
  'asset_concentration_max_percent',
  'blocked_counterparty_category',
] as const

export type PolicyRuleType = (typeof policyRuleTypes)[number]

export type PolicyRule = {
  id: string
  policySetId: string
  type: PolicyRuleType
  value: number | string
  label: string
  position: number
}

export type PolicySet = {
  id: string
  name: string
  description: string
  status: PolicyStatus
  isDefault: boolean
  createdAt: string
  updatedAt: string
  createdByAddress: string | null
  updatedByAddress: string | null
}

export type ResolvedPolicySnapshot = {
  policySetId: string
  name: string
  description: string
  runwayMonthsMin: number
  ethReviewThreshold: number
  stableReviewThreshold: number
  assetConcentrationMaxPercent: number
  blockedCounterpartyCategories: string[]
}

export type PolicySetRecord = PolicySet & {
  rules: PolicyRule[]
  resolved: ResolvedPolicySnapshot
}

export type PolicySetRulesInput = {
  runwayMonthsMin: number
  ethReviewThreshold: number
  stableReviewThreshold: number
  assetConcentrationMaxPercent: number
  blockedCounterpartyCategories: string[]
}

export type PolicySetWriteInput = {
  name: string
  description: string
  createdByAddress?: string | null
  updatedByAddress?: string | null
  rules: PolicySetRulesInput
}

export const defaultPolicyRules: PolicySetRulesInput = {
  runwayMonthsMin: 18,
  ethReviewThreshold: 400,
  stableReviewThreshold: 500000,
  assetConcentrationMaxPercent: 50,
  blockedCounterpartyCategories: ['unapproved bridge', 'sanctioned', 'unverified otc broker'],
}

const optionalAddressSchema = z.string().trim().min(1).max(160).nullable().optional()

export const policySetWriteSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(500).default(''),
  createdByAddress: optionalAddressSchema,
  updatedByAddress: optionalAddressSchema,
  rules: z.object({
    runwayMonthsMin: z.coerce.number().finite().positive().max(120),
    ethReviewThreshold: z.coerce.number().finite().nonnegative().max(1_000_000_000),
    stableReviewThreshold: z.coerce.number().finite().nonnegative().max(1_000_000_000_000),
    assetConcentrationMaxPercent: z.coerce.number().finite().min(0).max(100),
    blockedCounterpartyCategories: z.array(z.string().trim().min(1).max(120)).max(20).default([]),
  }),
})

export function buildPolicyRules(policySetId: string, input: PolicySetRulesInput): PolicyRule[] {
  return [
    {
      id: `${policySetId}-runway`,
      policySetId,
      type: 'runway_months_min',
      value: input.runwayMonthsMin,
      label: 'Runway minimum',
      position: 10,
    },
    {
      id: `${policySetId}-eth-review`,
      policySetId,
      type: 'eth_review_threshold',
      value: input.ethReviewThreshold,
      label: 'ETH review threshold',
      position: 20,
    },
    {
      id: `${policySetId}-stable-review`,
      policySetId,
      type: 'stable_review_threshold',
      value: input.stableReviewThreshold,
      label: 'Stable review threshold',
      position: 30,
    },
    {
      id: `${policySetId}-concentration`,
      policySetId,
      type: 'asset_concentration_max_percent',
      value: input.assetConcentrationMaxPercent,
      label: 'Asset concentration maximum',
      position: 40,
    },
    ...input.blockedCounterpartyCategories.map((category, index) => ({
      id: `${policySetId}-blocked-${index + 1}`,
      policySetId,
      type: 'blocked_counterparty_category' as const,
      value: category,
      label: `Blocked counterparty category ${index + 1}`,
      position: 100 + index,
    })),
  ]
}

export function resolvePolicySnapshot(policySet: PolicySet, rules: PolicyRule[]): ResolvedPolicySnapshot {
  const sorted = [...rules].sort((left, right) => left.position - right.position)

  return {
    policySetId: policySet.id,
    name: policySet.name,
    description: policySet.description,
    runwayMonthsMin: getNumericRuleValue(sorted, 'runway_months_min', defaultPolicyRules.runwayMonthsMin),
    ethReviewThreshold: getNumericRuleValue(sorted, 'eth_review_threshold', defaultPolicyRules.ethReviewThreshold),
    stableReviewThreshold: getNumericRuleValue(sorted, 'stable_review_threshold', defaultPolicyRules.stableReviewThreshold),
    assetConcentrationMaxPercent: getNumericRuleValue(sorted, 'asset_concentration_max_percent', defaultPolicyRules.assetConcentrationMaxPercent),
    blockedCounterpartyCategories: sorted
      .filter((rule) => rule.type === 'blocked_counterparty_category')
      .map((rule) => String(rule.value).trim())
      .filter(Boolean),
  }
}

export function hydratePolicySet(policySet: PolicySet, rules: PolicyRule[]): PolicySetRecord {
  return {
    ...policySet,
    rules: [...rules].sort((left, right) => left.position - right.position),
    resolved: resolvePolicySnapshot(policySet, rules),
  }
}

export function createLegacyPolicySnapshot(treasuryPolicy: string): ResolvedPolicySnapshot {
  return {
    policySetId: 'legacy-inline-policy',
    name: 'Inline policy payload',
    description: 'Resolved from the legacy treasuryPolicy payload.',
    runwayMonthsMin: extractRunwayValue(treasuryPolicy) ?? defaultPolicyRules.runwayMonthsMin,
    ethReviewThreshold: extractThresholdValue(treasuryPolicy, /(eth|weth)/i) ?? defaultPolicyRules.ethReviewThreshold,
    stableReviewThreshold: extractThresholdValue(treasuryPolicy, /(usdc|usd coin|stable)/i) ?? defaultPolicyRules.stableReviewThreshold,
    assetConcentrationMaxPercent: extractConcentrationValue(treasuryPolicy) ?? defaultPolicyRules.assetConcentrationMaxPercent,
    blockedCounterpartyCategories: extractBlockedCategories(treasuryPolicy),
  }
}

export function createPolicyNarrative(snapshot: ResolvedPolicySnapshot) {
  const categories = snapshot.blockedCounterpartyCategories.length
    ? snapshot.blockedCounterpartyCategories.join(', ')
    : 'none'

  return [
    `${snapshot.name}: ${snapshot.description || 'Structured treasury guardrails.'}`,
    `Runway minimum: ${snapshot.runwayMonthsMin} months.`,
    `ETH review threshold: ${snapshot.ethReviewThreshold} ETH.`,
    `Stable review threshold: ${formatNumber(snapshot.stableReviewThreshold)} units.`,
    `Asset concentration maximum: ${snapshot.assetConcentrationMaxPercent}%.`,
    `Blocked categories: ${categories}.`,
  ].join('\n')
}

export function getPolicySummaryItems(snapshot: ResolvedPolicySnapshot) {
  return [
    { label: 'Runway minimum', value: `${snapshot.runwayMonthsMin} months` },
    { label: 'ETH review threshold', value: `${formatCompactNumber(snapshot.ethReviewThreshold)} ETH` },
    { label: 'Stable review threshold', value: formatCurrencyLike(snapshot.stableReviewThreshold) },
    { label: 'Concentration max', value: `${snapshot.assetConcentrationMaxPercent}%` },
    {
      label: 'Blocked categories',
      value: snapshot.blockedCounterpartyCategories.length
        ? snapshot.blockedCounterpartyCategories.join(', ')
        : 'None configured',
    },
  ]
}

export function getPolicyStatusTone(status: PolicyStatus) {
  if (status === 'active') {
    return 'primary' as const
  }

  if (status === 'draft') {
    return 'warning' as const
  }

  return 'neutral' as const
}

export function getPolicyStatusLabel(status: PolicyStatus) {
  return status[0].toUpperCase() + status.slice(1)
}

function getNumericRuleValue(rules: PolicyRule[], type: Exclude<PolicyRuleType, 'blocked_counterparty_category'>, fallback: number) {
  const match = rules.find((rule) => rule.type === type)
  return typeof match?.value === 'number' ? match.value : fallback
}

function extractRunwayValue(text: string) {
  const runwayMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:month|months|mo)[^.\n]{0,40}runway/i)

  if (runwayMatch) {
    return Number(runwayMatch[1])
  }

  const fallbackMatch = text.match(/runway[^\d]{0,24}(\d+(?:\.\d+)?)/i)
  return fallbackMatch ? Number(fallbackMatch[1]) : null
}

function extractThresholdValue(text: string, assetPattern: RegExp) {
  const directMatch = text.match(new RegExp(`(\\d+[\\d,.]*(?:\\.\\d+)?)\\s*${assetPattern.source}[^.\\n]{0,50}(review|signer|manual)`, 'i'))

  if (directMatch) {
    return Number(directMatch[1].replace(/,/g, ''))
  }

  const reverseMatch = text.match(new RegExp(`(review|signer|manual)[^.\\n]{0,50}(\\d+[\\d,.]*(?:\\.\\d+)?)\\s*${assetPattern.source}`, 'i'))
  return reverseMatch ? Number(reverseMatch[2].replace(/,/g, '')) : null
}

function extractConcentrationValue(text: string) {
  const directMatch = text.match(/(?:concentration|allocation|exposure)[^.\n]{0,40}(\d+(?:\.\d+)?)\s*%/i)

  if (directMatch) {
    return Number(directMatch[1])
  }

  const belowMatch = text.match(/below\s*(\d+(?:\.\d+)?)\s*%/i)
  return belowMatch ? Number(belowMatch[1]) : null
}

function extractBlockedCategories(text: string) {
  const includeMatch = text.match(/blocked categories include\s+([^\n.]+)/i)

  if (!includeMatch?.[1]) {
    return [...defaultPolicyRules.blockedCounterpartyCategories]
  }

  return includeMatch[1]
    .split(/,| and /i)
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}

function formatCurrencyLike(value: number) {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`
  }

  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`
  }

  return `$${formatCompactNumber(value)}`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}
