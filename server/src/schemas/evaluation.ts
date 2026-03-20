import { z } from 'zod'

export const treasuryRequestSchema = z.object({
  policy: z.object({
    runwayMonthsMin: z.number().optional(),
    maxSingleTransferEth: z.number().optional(),
    blockedCategories: z.array(z.string()).default([]),
  }),
  treasuryState: z.object({
    stableRunwayMonths: z.number().optional(),
    ethConcentrationPct: z.number().optional(),
  }),
  request: z.object({
    amountEth: z.number(),
    destinationCategory: z.string(),
    reason: z.string(),
  }),
})
