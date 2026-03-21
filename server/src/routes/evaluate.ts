import { Hono } from 'hono'
import {
  evaluationResponseSchema,
  treasuryRequestSchema,
  type EvaluationResponse,
} from '../schemas/evaluation'
import {
  deriveDecision,
  evaluateDeterministicChecks,
  normalizeEvaluationInput,
} from '../lib/guardrails'
import { callVeniceReasoning } from '../lib/venice'

export const evaluateRoute = new Hono()

evaluateRoute.post('/evaluate/demo', async (c) => {
  const body = await c.req.json()
  const request = treasuryRequestSchema.parse(body)
  const normalized = normalizeEvaluationInput(request)
  const triggeredChecks = evaluateDeterministicChecks(normalized)
  const decision = deriveDecision(triggeredChecks)
  const venice = await callVeniceReasoning(request, triggeredChecks)

  const response: EvaluationResponse = {
    decision,
    confidence: venice.confidence,
    triggeredChecks,
    privateRationale: venice.privateRationale,
    publicSummary: venice.publicSummary,
    receipt: {
      receiptId: null,
      hash: null,
      urls: {
        receiptJson: null,
        agentJson: null,
        agentLog: null,
      },
    },
  }

  return c.json(evaluationResponseSchema.parse(response))
})
