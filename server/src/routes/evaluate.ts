import { Hono } from 'hono'
import { treasuryRequestSchema } from '../schemas/evaluation'
import { evaluateDeterministicChecks } from '../lib/guardrails'
import { buildVenicePayload } from '../lib/venice'

export const evaluateRoute = new Hono()

evaluateRoute.post('/evaluate/demo', async (c) => {
  const body = await c.req.json()
  const parsed = treasuryRequestSchema.parse(body)
  const checks = evaluateDeterministicChecks(parsed)
  const payload = await buildVenicePayload(parsed, checks)

  return c.json({
    success: true,
    mode: 'demo',
    checks,
    veniceRequestPreview: payload,
    result: {
      decision: checks.some((c: any) => c.passed === false) ? 'WARN' : 'ALLOW',
      confidence: 'medium',
      privateRationale: 'Placeholder private rationale pending live Venice wiring.',
      publicSafeSummary: 'Placeholder public-safe summary pending live Venice wiring.',
    },
  })
})
