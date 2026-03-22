import { createHash, randomUUID } from 'node:crypto'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { buildHostedArtifactUrls, registerEvaluationArtifacts } from '~/lib/agent-service'
import type { DemoConfidence, DemoDecision, DemoEvaluationRequest, DemoEvaluationResponse, PublicArtifactCheck, ReasoningProvider, TriggeredCheck } from '~/lib/api'
import { getRuntimeEnv } from '~/lib/runtime-env'

const requestSchema = z.object({
  treasuryPolicy: z.string().trim().min(1).max(8000),
  treasuryState: z.string().trim().min(1).max(8000),
  proposedAction: z.string().trim().min(1).max(4000),
})

export const Route = createFileRoute('/api/evaluate/demo')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = requestSchema.parse(await request.json())
          const evaluation = await evaluateDemoRequest(body)

          return Response.json(evaluation, {
            headers: {
              'Cache-Control': 'no-store',
            },
          })
        } catch (error) {
          const message = error instanceof z.ZodError
            ? 'Treasury policy, treasury state, and proposed action are all required.'
            : 'The demo evaluator could not process this request.'

          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})

export async function evaluateDemoRequest(input: DemoEvaluationRequest): Promise<DemoEvaluationResponse> {
  const checks = buildDeterministicChecks(input)
  const decision = deriveDecision(checks)
  const rationale = await generateNarrative(input, checks, decision)
  const receipt = buildReceipt(decision, rationale.confidence, rationale.reasoningProvider, checks, rationale.publicSummary)

  return {
    decision,
    confidence: rationale.confidence,
    reasoningProvider: rationale.reasoningProvider,
    triggeredChecks: checks,
    privateRationale: rationale.privateRationale,
    publicSummary: rationale.publicSummary,
    receipt,
  }
}

function buildDeterministicChecks(input: DemoEvaluationRequest): TriggeredCheck[] {
  const policyText = input.treasuryPolicy.toLowerCase()
  const stateText = input.treasuryState.toLowerCase()
  const actionText = input.proposedAction.toLowerCase()
  const amount = extractNumber(actionText)
  const runwayFloor = extractRunwayFloor(policyText) ?? 18
  const runwayState = extractRunwayFloor(stateText)
  const concentration = extractPercent(stateText)
  const blockedCategory = getBlockedCategoryMatch(policyText, actionText)
  const ethTransfer = amount !== null && /\beth\b|\bweth\b/.test(actionText)
  const stableTransfer = amount !== null && /\busdc\b|\busd coin\b|\bstable\b/.test(actionText)

  const checks: TriggeredCheck[] = []

  if (runwayState !== null && runwayState < runwayFloor) {
    checks.push({
      name: 'Runway Preservation',
      result: 'fail',
      detail: `Treasury state shows ${runwayState} months of runway against a ${runwayFloor}-month floor.`,
    })
  } else {
    checks.push({
      name: 'Runway Preservation',
      result: 'pass',
      detail: runwayState !== null
        ? `Stable reserve runway remains at ${runwayState} months, above the ${runwayFloor}-month floor.`
        : `No runway breach detected against the ${runwayFloor}-month reserve floor.`,
    })
  }

  if (ethTransfer && amount !== null && amount >= 400) {
    checks.push({
      name: 'Single Transfer Threshold',
      result: 'warn',
      detail: `Proposed action moves ${amount} ETH, which crosses the 400 ETH manual review threshold.`,
    })
  } else if (stableTransfer && amount !== null && amount >= 500000) {
    checks.push({
      name: 'Single Transfer Threshold',
      result: 'warn',
      detail: `Proposed action moves ${formatNumber(amount)} in stable assets and should be reviewed by a signer.`,
    })
  } else {
    checks.push({
      name: 'Single Transfer Threshold',
      result: 'pass',
      detail: 'Proposed action remains below the default manual review transfer threshold.',
    })
  }

  if (concentration !== null && concentration >= 65) {
    checks.push({
      name: 'Asset Concentration',
      result: 'fail',
      detail: `Treasury state reports ${concentration}% concentration, which breaches the concentration guardrail.`,
    })
  } else if (concentration !== null && concentration >= 50) {
    checks.push({
      name: 'Asset Concentration',
      result: 'warn',
      detail: `Treasury state reports ${concentration}% concentration, which is still allowed but close to the cap.`,
    })
  } else {
    checks.push({
      name: 'Asset Concentration',
      result: 'pass',
      detail: concentration !== null
        ? `Post-action concentration stays within the configured band at ${concentration}%.`
        : 'No concentration breach was detected from the supplied treasury state.',
    })
  }

  if (blockedCategory) {
    checks.push({
      name: 'Counterparty Category Policy',
      result: 'fail',
      detail: `Policy blocks ${blockedCategory}, and the proposed action references that category.`,
    })
  } else if (/unverified|bridge|otc broker|mixer|sanctioned/.test(actionText)) {
    checks.push({
      name: 'Counterparty Category Policy',
      result: 'warn',
      detail: 'Destination language suggests a sensitive counterparty category and should be manually reviewed.',
    })
  } else {
    checks.push({
      name: 'Counterparty Category Policy',
      result: 'pass',
      detail: 'No blocked destination or counterparty category was detected in the request.',
    })
  }

  return checks
}

function deriveDecision(checks: TriggeredCheck[]): DemoDecision {
  if (checks.some((check) => check.result === 'fail')) {
    return 'BLOCK'
  }

  if (checks.some((check) => check.result === 'warn')) {
    return 'WARN'
  }

  return 'ALLOW'
}

async function generateNarrative(
  input: DemoEvaluationRequest,
  checks: TriggeredCheck[],
  decision: DemoDecision,
): Promise<{ privateRationale: string; publicSummary: string; confidence: DemoConfidence; reasoningProvider: ReasoningProvider }> {
  const fallback = buildFallbackNarrative(checks, decision)
  const apiKey = getRuntimeEnv('VENICE_API_KEY') ?? getRuntimeEnv('VENICE_INFERENCE_KEY')
  const model = getRuntimeEnv('VENICE_MODEL') ?? 'qwen3-5-9b'

  if (!apiKey || !model) {
    return fallback
  }

  try {
    const response = await fetch('https://api.venice.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        venice_parameters: {
          strip_thinking_response: true,
        },
        messages: [
          {
            role: 'system',
            content:
              'You are the Venice private reasoning layer for Aegis Treasury Guardrails. Return strict JSON with privateRationale, publicSummary, and confidence. The private rationale may mention sensitive policy implications. The public summary must never include verbatim private policy or treasury state text.',
          },
          {
            role: 'user',
            content: JSON.stringify({
              input,
              decision,
              checks,
            }),
          },
        ],
      }),
    })

    if (!response.ok) {
      return fallback
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = payload.choices?.[0]?.message?.content

    if (!content) {
      return fallback
    }

    const parsed = extractVeniceJsonPayload(content) as {
      privateRationale?: string
      publicSummary?: string
      confidence?: DemoConfidence | number | string
    }

    if (!parsed.privateRationale || !parsed.publicSummary || parsed.confidence === undefined || parsed.confidence === null) {
      return fallback
    }

    const confidence = normalizeVeniceConfidence(parsed.confidence)

    if (!confidence) {
      return fallback
    }

    return {
      privateRationale: parsed.privateRationale,
      publicSummary: parsed.publicSummary,
      confidence,
      reasoningProvider: 'venice',
    }
  } catch {
    return fallback
  }
}

function extractVeniceJsonPayload(content: string) {
  const withoutThinking = content.replace(/<think>[\s\S]*?<\/think>/g, '').trim()
  const withoutCodeFence = withoutThinking.replace(/^```json\s*|```$/g, '').trim()
  const start = withoutCodeFence.indexOf('{')
  const end = withoutCodeFence.lastIndexOf('}')

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Venice response did not contain a JSON object.')
  }

  return JSON.parse(withoutCodeFence.slice(start, end + 1)) as unknown
}

function normalizeVeniceConfidence(confidence: DemoConfidence | number | string) {
  if (confidence === 'high' || confidence === 'medium' || confidence === 'low') {
    return confidence
  }

  if (typeof confidence === 'number') {
    if (confidence >= 0.8) {
      return 'high' as const
    }

    if (confidence >= 0.5) {
      return 'medium' as const
    }

    return 'low' as const
  }

  if (typeof confidence === 'string') {
    const normalized = confidence.trim().toLowerCase()

    if (normalized === 'high' || normalized === 'medium' || normalized === 'low') {
      return normalized as DemoConfidence
    }

    const numeric = Number(normalized)

    if (!Number.isNaN(numeric)) {
      return normalizeVeniceConfidence(numeric)
    }
  }

  return null
}

function buildFallbackNarrative(checks: TriggeredCheck[], decision: DemoDecision) {
  const failingChecks = checks.filter((check) => check.result === 'fail')
  const warningChecks = checks.filter((check) => check.result === 'warn')
  const driverChecks = [...failingChecks, ...warningChecks]
  const confidence: DemoConfidence = decision === 'ALLOW' ? 'high' : driverChecks.length >= 2 ? 'high' : 'medium'
  const primaryDriver = driverChecks[0]?.name ?? 'Deterministic guardrails'

  const privateRationale = decision === 'BLOCK'
    ? `Deterministic guardrails block this request because ${driverChecks.map((check) => check.detail.toLowerCase()).join(' ')} The policy outcome is set before any narrative layer runs, so Venice only explains the block rather than overriding it.`
    : decision === 'WARN'
      ? `Deterministic guardrails keep this request inside hard stop boundaries, but ${driverChecks.map((check) => check.detail.toLowerCase()).join(' ')} Venice should frame the outcome as a bounded recommendation that still requires human review.`
      : 'Deterministic guardrails do not detect a runway, concentration, transfer threshold, or counterparty breach. Venice should describe this as an allowed request with normal operator review hygiene.'

  const publicSummary = decision === 'BLOCK'
    ? `Blocked by treasury guardrails after ${primaryDriver.toLowerCase()} indicated a policy breach. Share the receipt with signers, but do not publish private policy text.`
    : decision === 'WARN'
      ? `Allowed to proceed only with manual review after ${primaryDriver.toLowerCase()} triggered an escalation threshold. Public artifacts stay high level and do not expose confidential policy details.`
      : 'Allowed within the currently supplied guardrails. No blocking policy breach was detected, and the public-safe explanation can remain concise.'

  return {
    privateRationale,
    publicSummary,
    confidence,
    reasoningProvider: 'deterministic-fallback' as const,
  }
}

function buildReceipt(
  decision: DemoDecision,
  confidence: DemoConfidence,
  reasoningProvider: ReasoningProvider,
  checks: TriggeredCheck[],
  publicSummary: string,
) {
  const createdAt = new Date().toISOString()
  const receiptId = `AEGIS-${createdAt.slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 8).toUpperCase()}`
  const publicChecks = checks.map<PublicArtifactCheck>((check) => ({
    name: check.name,
    result: check.result,
  }))
  const receiptBody = {
    schema: 'erc8004.guardrail.evaluation.v1',
    receiptId,
    createdAt,
    agent: 'Aegis Treasury Guardrails',
    decision,
    confidence,
    reasoningProvider,
    publicSummary,
    triggeredChecks: publicChecks,
  }
  const hash = `0x${createHash('sha256').update(JSON.stringify(receiptBody)).digest('hex')}`

  registerEvaluationArtifacts({
    receiptId,
    createdAt,
    decision,
    confidence,
    reasoningProvider,
    publicSummary,
    triggeredChecks: publicChecks,
    hash,
  })

  return {
    receiptId,
    hash,
    urls: buildHostedArtifactUrls(receiptId),
  }
}

function extractRunwayFloor(text: string) {
  const runwayMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:month|months|mo)[^.\n]{0,40}runway/)

  if (runwayMatch) {
    return Number(runwayMatch[1])
  }

  const fallbackMatch = text.match(/runway[^\d]{0,24}(\d+(?:\.\d+)?)/)
  return fallbackMatch ? Number(fallbackMatch[1]) : null
}

function extractPercent(text: string) {
  const match = text.match(/(\d+(?:\.\d+)?)\s*%/)
  return match ? Number(match[1]) : null
}

function extractNumber(text: string) {
  const cleaned = text.replace(/,/g, '')
  const match = cleaned.match(/(\d+(?:\.\d+)?)/)
  return match ? Number(match[1]) : null
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value)
}

function getBlockedCategoryMatch(policyText: string, actionText: string) {
  const categories = ['unapproved bridge', 'unverified otc', 'unverified otc broker', 'mixer', 'sanctioned', 'personal wallet']
  return categories.find((category) => policyText.includes(category) && actionText.includes(category)) ?? null
}
