import { normalizedInputSchema, type TreasuryRequest } from '../schemas/evaluation'

type NormalizedInput = ReturnType<typeof normalizeEvaluationInput>

function numberFromText(text: string, patterns: RegExp[]): number | undefined {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match?.[1]) {
      const numeric = Number(match[1].replace(/,/g, ''))
      if (!Number.isNaN(numeric)) return numeric
    }
  }
  return undefined
}

function categoriesFromText(text: string): string[] {
  const lower = text.toLowerCase()
  const categories: string[] = []
  const candidates = ['bridge', 'otc', 'market making', 'vendor', 'grant', 'liquidity', 'treasury']
  for (const candidate of candidates) {
    if (lower.includes(candidate)) categories.push(candidate)
  }
  return categories
}

export function normalizeEvaluationInput(raw: TreasuryRequest) {
  const policyText = raw.treasuryPolicy.toLowerCase()
  const stateText = raw.treasuryState.toLowerCase()
  const actionText = raw.proposedAction.toLowerCase()

  const treasuryPolicy = {
    runwayMonthsMin: numberFromText(policyText, [/(\d+(?:\.\d+)?)\s*months?/, /runway[^\d]*(\d+(?:\.\d+)?)/]),
    maxSingleTransferEth: numberFromText(policyText, [/(\d+(?:\.\d+)?)\s*eth/, /transfer[^\d]*(\d+(?:\.\d+)?)/]),
    blockedCategories: categoriesFromText(policyText),
  }

  const treasuryState = {
    stableRunwayMonths: numberFromText(stateText, [/(\d+(?:\.\d+)?)\s*months?/, /runway[^\d]*(\d+(?:\.\d+)?)/]),
    ethConcentrationPct: numberFromText(stateText, [/(\d+(?:\.\d+)?)\s*%/, /concentration[^\d]*(\d+(?:\.\d+)?)/]),
  }

  const proposedAction = {
    amountEth: numberFromText(actionText, [/(\d+(?:\.\d+)?)\s*eth/, /amount[^\d]*(\d+(?:\.\d+)?)/]),
    destinationCategory: categoriesFromText(actionText)[0] ?? undefined,
    reason: raw.proposedAction,
  }

  return normalizedInputSchema.parse({ treasuryPolicy, treasuryState, proposedAction })
}

export function evaluateDeterministicChecks(input: NormalizedInput) {
  const checks: Array<{ name: string; result: 'pass' | 'review' | 'fail'; detail: string }> = []

  if (
    input.treasuryPolicy.runwayMonthsMin !== undefined &&
    input.treasuryState.stableRunwayMonths !== undefined
  ) {
    checks.push({
      name: 'Runway Preservation',
      result:
        input.treasuryState.stableRunwayMonths >= input.treasuryPolicy.runwayMonthsMin
          ? 'pass'
          : 'fail',
      detail: 'Stable reserve runway compared against minimum policy threshold.',
    })
  }

  if (input.treasuryPolicy.maxSingleTransferEth !== undefined && input.proposedAction.amountEth !== undefined) {
    checks.push({
      name: 'Single Transfer Threshold',
      result:
        input.proposedAction.amountEth <= input.treasuryPolicy.maxSingleTransferEth
          ? 'pass'
          : 'review',
      detail: 'Transfer amount compared against manual review threshold.',
    })
  }

  if (
    input.proposedAction.destinationCategory &&
    input.treasuryPolicy.blockedCategories.includes(input.proposedAction.destinationCategory)
  ) {
    checks.push({
      name: 'Blocked Category',
      result: 'fail',
      detail: 'Destination category is blocked by policy.',
    })
  }

  if (checks.length === 0) {
    checks.push({
      name: 'Evaluation Baseline',
      result: 'review',
      detail: 'Not enough structured policy/state fields were detected to confidently pass or block the action.',
    })
  }

  return checks
}

export function deriveDecision(checks: Array<{ result: 'pass' | 'review' | 'fail' }>): 'ALLOW' | 'WARN' | 'BLOCK' {
  if (checks.some((check) => check.result === 'fail')) return 'BLOCK'
  if (checks.some((check) => check.result === 'review')) return 'WARN'
  return 'ALLOW'
}
