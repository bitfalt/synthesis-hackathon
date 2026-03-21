import { z } from 'zod'

export const treasuryRequestSchema = z.object({
  treasuryPolicy: z.string().min(1),
  treasuryState: z.string().min(1),
  proposedAction: z.string().min(1),
})

export type TreasuryRequest = z.infer<typeof treasuryRequestSchema>

export const normalizedInputSchema = z.object({
  treasuryPolicy: z.object({
    runwayMonthsMin: z.number().optional(),
    maxSingleTransferEth: z.number().optional(),
    blockedCategories: z.array(z.string()).default([]),
  }),
  treasuryState: z.object({
    stableRunwayMonths: z.number().optional(),
    ethConcentrationPct: z.number().optional(),
  }),
  proposedAction: z.object({
    amountEth: z.number().optional(),
    destinationCategory: z.string().optional(),
    reason: z.string().optional(),
  }),
})

export const checkResultSchema = z.enum(['pass', 'review', 'fail'])

export const triggeredCheckSchema = z.object({
  name: z.string(),
  result: checkResultSchema,
  detail: z.string(),
})

export const veniceReasoningSchema = z.object({
  privateRationale: z.string().min(1),
  publicSummary: z.string().min(1),
  confidence: z.enum(['high', 'medium', 'low']),
})

export const evaluationResponseSchema = z.object({
  decision: z.enum(['ALLOW', 'WARN', 'BLOCK']),
  confidence: z.enum(['high', 'medium', 'low']),
  triggeredChecks: z.array(triggeredCheckSchema),
  privateRationale: z.string(),
  publicSummary: z.string(),
  receipt: z.object({
    receiptId: z.string().nullable().optional(),
    hash: z.string().nullable().optional(),
    urls: z
      .object({
        receiptJson: z.string().nullable().optional(),
        agentJson: z.string().nullable().optional(),
        agentLog: z.string().nullable().optional(),
      })
      .optional(),
  }),
})

export type EvaluationResponse = z.infer<typeof evaluationResponseSchema>
