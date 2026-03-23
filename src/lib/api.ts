import type {
  PolicySetRecord as PolicySetRecordType,
  PolicySetWriteInput,
  PolicyStatus as PolicyStatusType,
  ResolvedPolicySnapshot as ResolvedPolicySnapshotType,
} from '~/lib/policies'
import { getPolicyStatusLabel as getPolicyStatusLabelBase, getPolicyStatusTone as getPolicyStatusToneBase } from '~/lib/policies'

export type { PolicySetRecord, PolicyStatus, ResolvedPolicySnapshot } from '~/lib/policies'

export const BASE_CHAIN_ID = 8453

export type DemoDecision = 'ALLOW' | 'WARN' | 'BLOCK'

export type DemoConfidence = 'high' | 'medium' | 'low'

export type ReasoningProvider = 'venice' | 'deterministic-fallback'

export type TriggeredCheck = {
  name: string
  result: 'pass' | 'warn' | 'fail'
  detail: string
}

export type PolicyEnforcement = 'block' | 'review' | 'advisory'

export type PolicyRecord = {
  id: string
  policySetId: string
  name: string
  summary: string
  enforcement: PolicyEnforcement
  status: PolicyStatusType
  updatedAt: string
  updatedByAddress: string | null
  updatedByDisplay: string | null
}

export type PolicySnapshot = {
  policySetId: string
  policySetName: string
  resolvedAt: string
  policies: Array<{
    id: string
    name: string
    summary: string
    enforcement: PolicyEnforcement
    status: PolicyStatusType
  }>
}

export type LegacyDemoEvaluationRequest = {
  treasuryPolicy: string
  treasuryState: string
  proposedAction: string
}

export type PolicySetDemoEvaluationRequest = {
  policySetId?: string
  treasuryState?: string
  proposedAction?: string
  state?: string
  action?: string
}

export type DemoEvaluationRequest = LegacyDemoEvaluationRequest | PolicySetDemoEvaluationRequest

export type DemoEvaluationResponse = {
  decision: DemoDecision
  confidence: DemoConfidence
  reasoningProvider: ReasoningProvider
  triggeredChecks: TriggeredCheck[]
  privateRationale: string
  publicSummary: string
  policySet: {
    id: string
    name: string
    status: PolicyStatusType | 'draft'
  }
  policySnapshot: ResolvedPolicySnapshotType
  receipt: {
    receiptId?: string | null
    hash?: string | null
    urls?: {
      receiptJson?: string | null
      agentJson?: string | null
      agentLog?: string | null
    }
  }
}

export type PublicArtifactCheck = {
  name: string
  result: TriggeredCheck['result']
}

export type EvaluationCheckRecord = TriggeredCheck & {
  id: string
  evaluationId: string
}

export type StoredEvaluation = DemoEvaluationResponse & {
  id: string
  receiptId: string
  createdAt: string
  treasuryStateSnapshot: string
  proposedAction: string
  policySetId: string | null
  submittedByAddress: string | null
  submittedByDisplay: string | null
  receiptHash: string | null
  checks: EvaluationCheckRecord[]
}

export type OperatorSession = {
  address: string
  display: string
  chainId: number
  issuedAt: string
  expiresAt: string
}

export type AuthChallengeResponse = {
  nonce: string
  message: string
  expiresAt: string
}

export type PolicySetPayload = PolicySetWriteInput

async function readJsonResponse<T>(response: Response, fallbackMessage: string) {
  if (!response.ok) {
    let message = fallbackMessage

    try {
      const payload = (await response.json()) as { error?: string }
      message = payload.error || fallbackMessage
    } catch {
      message = fallbackMessage
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

export async function fetchOperatorSession() {
  const payload = await readJsonResponse<{ session: OperatorSession | null }>(
    await fetch('/api/auth/session', {
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
    }),
    'Unable to read operator session.',
  )

  return payload.session
}

export async function requestOperatorChallenge(address: string) {
  return readJsonResponse<AuthChallengeResponse>(
    await fetch('/api/auth/challenge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ address }),
    }),
    'Unable to start operator sign-in.',
  )
}

export async function verifyOperatorSession(input: {
  address: string
  signature: string
  nonce: string
}) {
  const payload = await readJsonResponse<{ session: OperatorSession }>(
    await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(input),
    }),
    'Unable to verify the operator signature.',
  )

  return payload.session
}

export async function logoutOperatorSession() {
  await readJsonResponse<{ ok: true }>(
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    }),
    'Unable to clear the operator session.',
  )
}

export async function fetchPolicySets() {
  return readJsonResponse<PolicySetRecordType[]>(
    await fetch('/api/policies', {
      headers: {
        Accept: 'application/json',
      },
    }),
    'Unable to load policy sets.',
  )
}

export async function fetchPolicySet(policySetId: string) {
  return readJsonResponse<PolicySetRecordType>(
    await fetch(`/api/policies/${policySetId}`, {
      headers: {
        Accept: 'application/json',
      },
    }),
    'Unable to load that policy set.',
  )
}

export async function createPolicySet(payload: PolicySetPayload) {
  return readJsonResponse<PolicySetRecordType>(
    await fetch('/api/policies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
    'Unable to create the policy set.',
  )
}

export async function updatePolicySet(policySetId: string, payload: PolicySetPayload) {
  return readJsonResponse<PolicySetRecordType>(
    await fetch(`/api/policies/${policySetId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
    'Unable to update the policy set.',
  )
}

export async function archivePolicySet(policySetId: string) {
  return readJsonResponse<PolicySetRecordType>(
    await fetch(`/api/policies/${policySetId}/archive`, {
      method: 'POST',
    }),
    'Unable to archive the policy set.',
  )
}

export async function activatePolicySet(policySetId: string) {
  return readJsonResponse<PolicySetRecordType>(
    await fetch(`/api/policies/${policySetId}/activate`, {
      method: 'POST',
    }),
    'Unable to activate the policy set.',
  )
}

export async function fetchEvaluationHistory() {
  const payload = await readJsonResponse<{ evaluations: StoredEvaluation[] }>(
    await fetch('/api/evaluations', {
      headers: {
        Accept: 'application/json',
      },
    }),
    'Unable to load evaluation history.',
  )

  return payload.evaluations
}

export async function fetchEvaluation(evaluationId: string) {
  const payload = await readJsonResponse<{ evaluation: StoredEvaluation }>(
    await fetch(`/api/evaluations/${evaluationId}`, {
      headers: {
        Accept: 'application/json',
      },
    }),
    'Unable to load that evaluation record.',
  )

  return payload.evaluation
}

export async function fetchStoredEvaluation(evaluationId?: string | null) {
  if (!evaluationId) {
    const history = await fetchEvaluationHistory()
    return history[0] ?? null
  }

  return fetchEvaluation(evaluationId)
}

export async function submitDemoEvaluation(payload: DemoEvaluationRequest) {
  return readJsonResponse<DemoEvaluationResponse>(
    await fetch('/api/evaluate/demo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }),
    'Unable to evaluate this treasury action right now.',
  )
}

export function formatEvaluationTimestamp(timestamp: string) {
  const value = new Date(timestamp)

  if (Number.isNaN(value.getTime())) {
    return timestamp
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(value)
}

export function shortenAddress(address?: string | null) {
  if (!address) {
    return 'Unavailable'
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function getDecisionTone(decision: DemoDecision) {
  if (decision === 'ALLOW') {
    return 'primary' as const
  }

  if (decision === 'WARN') {
    return 'warning' as const
  }

  return 'info' as const
}

export function getCheckTone(result: TriggeredCheck['result']) {
  if (result === 'pass') {
    return 'primary' as const
  }

  if (result === 'warn') {
    return 'warning' as const
  }

  return 'info' as const
}

export function getCheckLabel(result: TriggeredCheck['result']) {
  if (result === 'pass') {
    return 'pass'
  }

  if (result === 'warn') {
    return 'warn'
  }

  return 'fail'
}

export function getReasoningProviderLabel(provider: ReasoningProvider) {
  return provider === 'venice' ? 'Venice live' : 'Fallback reasoning'
}

export function getReasoningProviderTone(provider: ReasoningProvider) {
  return provider === 'venice' ? 'primary' as const : 'warning' as const
}

export function getPolicyStatusTone(status: PolicyStatusType) {
  return getPolicyStatusToneBase(status)
}

export function getPolicyStatusLabel(status: PolicyStatusType) {
  return getPolicyStatusLabelBase(status)
}
