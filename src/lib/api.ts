export type DemoDecision = 'ALLOW' | 'WARN' | 'BLOCK'

export type DemoConfidence = 'high' | 'medium' | 'low'

export type ReasoningProvider = 'venice' | 'deterministic-fallback'

export type TriggeredCheck = {
  name: string
  result: 'pass' | 'warn' | 'fail'
  detail: string
}

export type DemoEvaluationRequest = {
  treasuryPolicy: string
  treasuryState: string
  proposedAction: string
}

export type DemoEvaluationResponse = {
  decision: DemoDecision
  confidence: DemoConfidence
  reasoningProvider: ReasoningProvider
  triggeredChecks: TriggeredCheck[]
  privateRationale: string
  publicSummary: string
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

export type StoredEvaluation = DemoEvaluationResponse & {
  id: string
  createdAt: string
}

const STORAGE_KEY = 'aegis.demo.evaluations.v1'
const MAX_HISTORY_ENTRIES = 12

let memoryHistory: StoredEvaluation[] = []

function canUseSessionStorage() {
  return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined'
}

function createClientEvaluationId() {
  return `session-${Math.random().toString(36).slice(2, 10)}`
}

function parseStoredHistory(rawValue: string | null): StoredEvaluation[] {
  if (!rawValue) {
    return []
  }

  try {
    const parsed = JSON.parse(rawValue) as StoredEvaluation[]

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((entry) => Boolean(entry?.id && entry?.createdAt && entry?.decision))
  } catch {
    return []
  }
}

function writeHistory(history: StoredEvaluation[]) {
  memoryHistory = history

  if (canUseSessionStorage()) {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }
}

export function loadEvaluationHistory() {
  if (!canUseSessionStorage()) {
    return memoryHistory
  }

  const history = parseStoredHistory(window.sessionStorage.getItem(STORAGE_KEY))
  memoryHistory = history
  return history
}

export function getStoredEvaluation(evaluationId?: string | null) {
  const history = loadEvaluationHistory()

  if (!history.length) {
    return null
  }

  if (!evaluationId) {
    return history[0] ?? null
  }

  return history.find((entry) => entry.id === evaluationId) ?? null
}

export function saveCompletedEvaluation(response: DemoEvaluationResponse) {
  const history = loadEvaluationHistory()

  const record: StoredEvaluation = {
    ...response,
    id: response.receipt.receiptId ?? createClientEvaluationId(),
    createdAt: new Date().toISOString(),
  }

  const nextHistory = [record, ...history.filter((entry) => entry.id !== record.id)].slice(0, MAX_HISTORY_ENTRIES)
  writeHistory(nextHistory)
  return record
}

export async function submitDemoEvaluation(payload: DemoEvaluationRequest) {
  const response = await fetch('/api/evaluate/demo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const fallbackMessage = 'Unable to evaluate this treasury action right now.'
    let message = fallbackMessage

    try {
      const errorPayload = (await response.json()) as { error?: string }
      message = errorPayload.error || fallbackMessage
    } catch {
      message = fallbackMessage
    }

    throw new Error(message)
  }

  return (await response.json()) as DemoEvaluationResponse
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
