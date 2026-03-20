export function evaluateDeterministicChecks(input: any) {
  const checks = []
  if (input.policy?.runwayMonthsMin && input.treasuryState?.stableRunwayMonths !== undefined) {
    checks.push({
      name: 'runway_floor',
      passed: input.treasuryState.stableRunwayMonths >= input.policy.runwayMonthsMin,
      detail: 'Stable reserve runway compared against minimum policy threshold.',
    })
  }
  if (input.policy?.maxSingleTransferEth !== undefined) {
    checks.push({
      name: 'single_transfer_threshold',
      passed: input.request.amountEth <= input.policy.maxSingleTransferEth,
      detail: 'Transfer amount compared against manual review threshold.',
    })
  }
  if ((input.policy?.blockedCategories || []).includes(input.request.destinationCategory)) {
    checks.push({
      name: 'blocked_category',
      passed: false,
      detail: 'Destination category is blocked by policy.',
    })
  }
  return checks
}
