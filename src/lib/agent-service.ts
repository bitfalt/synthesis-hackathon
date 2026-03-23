import { createHash } from 'node:crypto'
import type {
  DemoConfidence,
  DemoDecision,
  PublicArtifactCheck,
  ReasoningProvider,
  StoredEvaluation,
  TriggeredCheck,
} from '~/lib/api'
import type { ResolvedPolicySnapshot } from '~/lib/policies'
import { getRuntimeEnv } from '~/lib/runtime-env'

export const AEGIS_BASE_NETWORK = 'eip155:8453'
export const AEGIS_BASE_CHAIN_ID = 8453
export const AEGIS_BASE_USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
export const AEGIS_X402_FACILITATOR_URL = 'https://api.cdp.coinbase.com/platform/v2/x402'
export const AEGIS_DEFAULT_X402_PAY_TO_ADDRESS = '0x0977De4FbF977Db858A1dC27d588f9F661263d86'

type PublicReceiptArtifact = {
  schema: string
  receiptId: string
  createdAt: string
  agent: string
  decision: DemoDecision
  confidence: DemoConfidence
  reasoningProvider: ReasoningProvider
  policySet: {
    id: string
    name: string
  }
  policySnapshotHash: string
  operatorAttribution: 'wallet-attributed' | 'anonymous-demo'
  publicSummary: string
  triggeredChecks: PublicArtifactCheck[]
  hash: string | null
}

type AgentLogArtifact = {
  entries: Array<{
    createdAt: string
    receiptId: string
    decision: DemoDecision
    confidence: DemoConfidence
    reasoningProvider: ReasoningProvider
    policySet: {
      id: string
      name: string
    }
    policySnapshotHash: string
    operatorAttribution: 'wallet-attributed' | 'anonymous-demo'
    publicSummary: string
    triggeredChecks: PublicArtifactCheck[]
  }>
}

type ReceiptArtifactHashless = Omit<PublicReceiptArtifact, 'hash'>

type ReceiptArtifactPayloadInput = {
  receiptId: string
  createdAt: string
  decision: DemoDecision
  confidence: DemoConfidence
  reasoningProvider: ReasoningProvider
  policySet: {
    id: string
    name: string
  }
  policySnapshot: ResolvedPolicySnapshot
  submittedByAddress: string | null
  publicSummary: string
  triggeredChecks: Array<Pick<TriggeredCheck, 'name' | 'result'>>
}

export function buildPolicySnapshotHash(policySnapshot: ResolvedPolicySnapshot) {
  return `0x${createHash('sha256').update(JSON.stringify(policySnapshot)).digest('hex')}`
}

export function getOperatorAttribution(evaluation: Pick<StoredEvaluation, 'submittedByAddress'>) {
  return evaluation.submittedByAddress ? 'wallet-attributed' as const : 'anonymous-demo' as const
}

export function getX402ServiceConfig() {
  const mode = getRuntimeEnv('AEGIS_X402_MODE') ?? 'open-demo'
  const payTo = getRuntimeEnv('AEGIS_X402_PAY_TO_ADDRESS') ?? getRuntimeEnv('X402_PAY_TO_ADDRESS') ?? AEGIS_DEFAULT_X402_PAY_TO_ADDRESS
  const price = getRuntimeEnv('AEGIS_X402_PRICE_USD') ?? '$0.05'
  const demoBypass = mode === 'demo-bypass' || (mode !== 'open-demo' && getRuntimeEnv('AEGIS_X402_DEMO_BYPASS') === 'true')
  const amount = usdPriceToUsdcAtomicUnits(price)
  const enabled = mode === 'payment-required' || demoBypass

  return {
    enabled,
    mode: enabled
      ? demoBypass
        ? 'demo-bypass'
        : 'payment-required'
      : 'open-demo',
    payTo,
    price,
    amount,
    demoBypass,
    network: AEGIS_BASE_NETWORK,
    asset: AEGIS_BASE_USDC_ADDRESS,
    maxTimeoutSeconds: 60,
  }
}

export function buildHostedArtifactUrls(receiptId: string) {
  return {
    receiptJson: `/api/receipts/${receiptId}`,
    agentJson: '/.well-known/agent.json',
    agentLog: `/api/agent-logs/${receiptId}`,
  }
}

export function buildPublicArtifactChecks(checks: Array<Pick<TriggeredCheck, 'name' | 'result'>>) {
  return checks.map<PublicArtifactCheck>((check) => ({
    name: check.name,
    result: check.result,
  }))
}

export function buildReceiptArtifactPayload(input: ReceiptArtifactPayloadInput): ReceiptArtifactHashless {
  return {
    schema: 'erc8004.guardrail.evaluation.v1',
    receiptId: input.receiptId,
    createdAt: input.createdAt,
    agent: 'Aegis Treasury Guardrails',
    decision: input.decision,
    confidence: input.confidence,
    reasoningProvider: input.reasoningProvider,
    policySet: {
      id: input.policySet.id,
      name: input.policySet.name,
    },
    policySnapshotHash: buildPolicySnapshotHash(input.policySnapshot),
    operatorAttribution: input.submittedByAddress ? 'wallet-attributed' : 'anonymous-demo',
    publicSummary: input.publicSummary,
    triggeredChecks: buildPublicArtifactChecks(input.triggeredChecks),
  }
}

export function hashReceiptArtifactPayload(payload: ReceiptArtifactHashless) {
  return `0x${createHash('sha256').update(JSON.stringify(payload)).digest('hex')}`
}

export function buildCanonicalReceiptHash(evaluation: Pick<
  StoredEvaluation,
  'receiptId' | 'createdAt' | 'decision' | 'confidence' | 'reasoningProvider' | 'policySet' | 'policySnapshot' | 'submittedByAddress' | 'publicSummary' | 'triggeredChecks'
>) {
  return hashReceiptArtifactPayload(
    buildReceiptArtifactPayload({
      receiptId: evaluation.receiptId,
      createdAt: evaluation.createdAt,
      decision: evaluation.decision,
      confidence: evaluation.confidence,
      reasoningProvider: evaluation.reasoningProvider,
      policySet: evaluation.policySet,
      policySnapshot: evaluation.policySnapshot,
      submittedByAddress: evaluation.submittedByAddress,
      publicSummary: evaluation.publicSummary,
      triggeredChecks: evaluation.triggeredChecks,
    }),
  )
}

export function buildReceiptArtifact(evaluation: StoredEvaluation): PublicReceiptArtifact {
  const payload = buildReceiptArtifactPayload({
    receiptId: evaluation.receiptId,
    createdAt: evaluation.createdAt,
    decision: evaluation.decision,
    confidence: evaluation.confidence,
    reasoningProvider: evaluation.reasoningProvider,
    policySet: evaluation.policySet,
    policySnapshot: evaluation.policySnapshot,
    submittedByAddress: evaluation.submittedByAddress,
    publicSummary: evaluation.publicSummary,
    triggeredChecks: evaluation.triggeredChecks,
  })

  return {
    ...payload,
    hash: hashReceiptArtifactPayload(payload),
  }
}

export function buildAgentLogArtifact(evaluation: StoredEvaluation): AgentLogArtifact {
  return {
    entries: [
      {
        createdAt: evaluation.createdAt,
        receiptId: evaluation.receiptId,
        decision: evaluation.decision,
        confidence: evaluation.confidence,
        reasoningProvider: evaluation.reasoningProvider,
        policySet: {
          id: evaluation.policySet.id,
          name: evaluation.policySet.name,
        },
        policySnapshotHash: buildPolicySnapshotHash(evaluation.policySnapshot),
        operatorAttribution: getOperatorAttribution(evaluation),
        publicSummary: evaluation.publicSummary,
        triggeredChecks: buildPublicArtifactChecks(evaluation.triggeredChecks),
      },
    ],
  }
}

export function getX402DiscoveryDocument() {
  const x402 = getX402ServiceConfig()

  return {
    version: 1,
    service: 'Aegis Treasury Guardrails',
    mode: x402.mode,
    network: x402.network,
    settlementStatus: x402.mode === 'payment-required' ? 'challenge-only' : 'demo-open',
    facilitator: {
      url: AEGIS_X402_FACILITATOR_URL,
      integrationStatus: 'not yet verified on the server runtime',
    },
    endpoints: [
      x402.enabled
        ? {
            path: '/api/evaluate/service',
            method: 'POST',
            description: 'Treasury guardrail evaluation service',
            scheme: 'exact',
            network: x402.network,
            price: x402.price,
            amount: x402.amount,
            asset: x402.asset,
            payTo: x402.payTo,
            maxTimeoutSeconds: x402.maxTimeoutSeconds,
          }
        : {
            path: '/api/evaluate/service',
            method: 'POST',
            description: 'Open demo evaluation service',
            network: x402.network,
            price: '$0.00',
            note: 'Set AEGIS_X402_MODE=payment-required or AEGIS_X402_MODE=demo-bypass to enable x402 negotiation on Base.',
          },
    ],
  }
}

export function buildX402PaymentRequiredResponse() {
  const x402 = getX402ServiceConfig()

  if (!x402.enabled || !x402.payTo) {
    return null
  }

  return {
    x402Version: 2,
    accepts: [
      {
        scheme: 'exact',
        network: x402.network,
        amount: x402.amount,
        asset: x402.asset,
        payTo: x402.payTo,
        maxTimeoutSeconds: x402.maxTimeoutSeconds,
        extra: {
          assetTransferMethod: 'eip3009',
          name: 'USDC',
          version: '2',
          note: x402.demoBypass
            ? 'Server is in x402 demo bypass mode and does not verify facilitator settlement yet.'
            : 'Server expects an x402 payment header before evaluating the request.',
        },
      },
    ],
    error: 'X-PAYMENT header is required',
  }
}

function usdPriceToUsdcAtomicUnits(price: string) {
  const normalized = price.replace('$', '').trim()
  const value = Number(normalized)

  if (Number.isNaN(value) || value <= 0) {
    return '0'
  }

  return Math.round(value * 1_000_000).toString()
}
