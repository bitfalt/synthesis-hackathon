export type TriggeredCheck = {
  name: string
  result: 'pass' | 'review' | 'fail'
  detail: string
}

export type EvaluationResponse = {
  decision: 'ALLOW' | 'WARN' | 'BLOCK'
  confidence: 'high' | 'medium' | 'low'
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

export async function evaluateTreasuryDemo(input: {
  treasuryPolicy: string
  treasuryState: string
  proposedAction: string
}) {
  const response = await fetch('/api/evaluate/demo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  if (!response.ok) {
    throw new Error(`Evaluation request failed with status ${response.status}`)
  }

  return (await response.json()) as EvaluationResponse
}
