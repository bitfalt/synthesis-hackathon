import type { DemoConfidence, DemoDecision, PublicArtifactCheck, ReasoningProvider } from '~/lib/api'
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
  publicSummary: string
  triggeredChecks: PublicArtifactCheck[]
  hash: string
}

type AgentLogArtifact = {
  entries: Array<{
    createdAt: string
    receiptId: string
    decision: DemoDecision
    confidence: DemoConfidence
    reasoningProvider: ReasoningProvider
    publicSummary: string
    triggeredChecks: PublicArtifactCheck[]
  }>
}

type ArtifactStore = {
  receipts: Map<string, PublicReceiptArtifact>
  logs: Map<string, AgentLogArtifact>
}

function getArtifactStore() {
  const runtime = globalThis as typeof globalThis & {
    __aegisArtifactStore?: ArtifactStore
  }

  if (!runtime.__aegisArtifactStore) {
    runtime.__aegisArtifactStore = {
      receipts: new Map(),
      logs: new Map(),
    }
  }

  return runtime.__aegisArtifactStore
}

export function getX402ServiceConfig() {
  const payTo = getRuntimeEnv('AEGIS_X402_PAY_TO_ADDRESS') ?? getRuntimeEnv('X402_PAY_TO_ADDRESS') ?? AEGIS_DEFAULT_X402_PAY_TO_ADDRESS
  const price = getRuntimeEnv('AEGIS_X402_PRICE_USD') ?? '$0.05'
  const demoBypass = getRuntimeEnv('AEGIS_X402_DEMO_BYPASS') === 'true'
  const amount = usdPriceToUsdcAtomicUnits(price)

  return {
    enabled: Boolean(payTo),
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

export function registerEvaluationArtifacts(input: {
  receiptId: string
  createdAt: string
  decision: DemoDecision
  confidence: DemoConfidence
  reasoningProvider: ReasoningProvider
  publicSummary: string
  triggeredChecks: PublicArtifactCheck[]
  hash: string
}) {
  const store = getArtifactStore()

  store.receipts.set(input.receiptId, {
    schema: 'erc8004.guardrail.evaluation.v1',
    receiptId: input.receiptId,
    createdAt: input.createdAt,
    agent: 'Aegis Treasury Guardrails',
    decision: input.decision,
    confidence: input.confidence,
    reasoningProvider: input.reasoningProvider,
    publicSummary: input.publicSummary,
    triggeredChecks: input.triggeredChecks,
    hash: input.hash,
  })

  store.logs.set(input.receiptId, {
    entries: [
      {
        createdAt: input.createdAt,
        receiptId: input.receiptId,
        decision: input.decision,
        confidence: input.confidence,
        reasoningProvider: input.reasoningProvider,
        publicSummary: input.publicSummary,
        triggeredChecks: input.triggeredChecks,
      },
    ],
  })
}

export function getReceiptArtifact(receiptId: string) {
  return getArtifactStore().receipts.get(receiptId) ?? null
}

export function getAgentLogArtifact(receiptId: string) {
  return getArtifactStore().logs.get(receiptId) ?? null
}

export function getX402DiscoveryDocument() {
  const x402 = getX402ServiceConfig()

  return {
    version: 1,
    service: 'Aegis Treasury Guardrails',
    mode: x402.enabled
      ? x402.demoBypass
        ? 'x402-demo-bypass'
        : 'x402-payment-required'
      : 'open-demo',
    network: x402.network,
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
            note: 'Set AEGIS_X402_PAY_TO_ADDRESS to require x402 payment negotiation on Base.',
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
