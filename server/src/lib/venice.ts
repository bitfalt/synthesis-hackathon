import { z } from 'zod'
import {
  triggeredCheckSchema,
  veniceReasoningSchema,
  type TreasuryRequest,
} from '../schemas/evaluation'

const veniceChatSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
        }),
      }),
    )
    .min(1),
})

export async function callVeniceReasoning(
  input: TreasuryRequest,
  checks: Array<z.infer<typeof triggeredCheckSchema>>,
) {
  const apiKey = process.env.VENICE_API_KEY

  const fallback = {
    privateRationale: `Private rationale fallback: ${checks
      .map((check) => `${check.name} => ${check.result}`)
      .join(', ')}.`,
    publicSummary: `Public-safe summary fallback: the action was evaluated against ${checks.length} guardrail check(s).`,
    confidence: checks.some((check) => check.result === 'fail') ? 'high' : 'medium',
  } as const

  if (!apiKey) {
    return veniceReasoningSchema.parse(fallback)
  }

  const promptPayload = {
    model: 'venice-uncensored',
    messages: [
      {
        role: 'system',
        content:
          'You are Aegis Treasury Guardrails. The deterministic checks already happened and the final policy decision is not yours to override. Return JSON only with keys privateRationale, publicSummary, and confidence. privateRationale can mention sensitive operational context. publicSummary must be safe to show publicly without revealing private treasury rules. confidence must be high, medium, or low.',
      },
      {
        role: 'user',
        content: JSON.stringify({
          treasuryPolicy: input.treasuryPolicy,
          treasuryState: input.treasuryState,
          proposedAction: input.proposedAction,
          triggeredChecks: checks,
        }),
      },
    ],
    temperature: 0.2,
  }

  const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(promptPayload),
  })

  if (!response.ok) {
    return veniceReasoningSchema.parse(fallback)
  }

  const payload = veniceChatSchema.parse(await response.json())
  const content = payload.choices[0]?.message.content ?? '{}'

  try {
    return veniceReasoningSchema.parse(JSON.parse(content))
  } catch {
    return veniceReasoningSchema.parse(fallback)
  }
}
