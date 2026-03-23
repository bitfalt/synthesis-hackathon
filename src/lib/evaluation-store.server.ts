import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { buildHostedArtifactUrls } from '~/lib/agent-service'
import type { DemoEvaluationRequest, DemoEvaluationResponse, EvaluationCheckRecord, StoredEvaluation } from '~/lib/api'

const STORE_VERSION = 2
const STORE_DIRECTORY = join(process.cwd(), '.data')
const STORE_FILE = join(STORE_DIRECTORY, 'aegis-evaluations.json')

type EvaluationStoreFile = {
  version: number
  evaluations: StoredEvaluation[]
}

let cachedStore: EvaluationStoreFile | null = null
let activeRead: Promise<EvaluationStoreFile> | null = null
let writeQueue: Promise<unknown> = Promise.resolve()

function createEmptyStore(): EvaluationStoreFile {
  return {
    version: STORE_VERSION,
    evaluations: [],
  }
}

function normalizeChecks(evaluationId: string, checks: unknown): EvaluationCheckRecord[] {
  if (!Array.isArray(checks)) {
    return []
  }

  return checks
    .map((check, index) => {
      if (!check || typeof check !== 'object') {
        return null
      }

      const candidate = check as Record<string, unknown>

      if (
        typeof candidate.name !== 'string' ||
        typeof candidate.detail !== 'string' ||
        (candidate.result !== 'pass' && candidate.result !== 'warn' && candidate.result !== 'fail')
      ) {
        return null
      }

      return {
        id: typeof candidate.id === 'string' ? candidate.id : `${evaluationId}-check-${index + 1}`,
        evaluationId,
        name: candidate.name,
        result: candidate.result,
        detail: candidate.detail,
      } satisfies EvaluationCheckRecord
    })
    .filter((check): check is EvaluationCheckRecord => Boolean(check))
}

function normalizeEvaluation(candidate: unknown): StoredEvaluation | null {
  if (!candidate || typeof candidate !== 'object') {
    return null
  }

  const entry = candidate as Record<string, unknown>
  const id = typeof entry.id === 'string' ? entry.id : typeof entry.receiptId === 'string' ? entry.receiptId : null
  const createdAt = typeof entry.createdAt === 'string' ? entry.createdAt : null
  const decision = entry.decision
  const confidence = entry.confidence
  const reasoningProvider = entry.reasoningProvider
  const publicSummary = typeof entry.publicSummary === 'string' ? entry.publicSummary : null
  const privateRationale = typeof entry.privateRationale === 'string' ? entry.privateRationale : null
  const treasuryStateSnapshot = typeof entry.treasuryStateSnapshot === 'string' ? entry.treasuryStateSnapshot : null
  const proposedAction = typeof entry.proposedAction === 'string' ? entry.proposedAction : null
  const policySet = entry.policySet && typeof entry.policySet === 'object'
    ? entry.policySet as Record<string, unknown>
    : null
  const policySnapshot = entry.policySnapshot && typeof entry.policySnapshot === 'object'
    ? entry.policySnapshot as Record<string, unknown>
    : null
  const receipt = entry.receipt && typeof entry.receipt === 'object'
    ? entry.receipt as Record<string, unknown>
    : null
  const urls = receipt?.urls && typeof receipt.urls === 'object'
    ? receipt.urls as Record<string, unknown>
    : null

  if (
    !id ||
    !createdAt ||
    (decision !== 'ALLOW' && decision !== 'WARN' && decision !== 'BLOCK') ||
    (confidence !== 'high' && confidence !== 'medium' && confidence !== 'low') ||
    (reasoningProvider !== 'venice' && reasoningProvider !== 'deterministic-fallback') ||
    !publicSummary ||
    !privateRationale ||
    !treasuryStateSnapshot ||
    !proposedAction ||
    !policySet ||
    !policySnapshot ||
    typeof policySet.id !== 'string' ||
    typeof policySet.name !== 'string' ||
    typeof policySet.status !== 'string' ||
    typeof policySnapshot.policySetId !== 'string' ||
    typeof policySnapshot.name !== 'string'
  ) {
    return null
  }

  const checks = normalizeChecks(id, entry.triggeredChecks)
  const receiptId = typeof entry.receiptId === 'string'
    ? entry.receiptId
    : typeof receipt?.receiptId === 'string'
      ? receipt.receiptId
      : id
  const receiptHash = typeof entry.receiptHash === 'string'
    ? entry.receiptHash
    : typeof receipt?.hash === 'string'
      ? receipt.hash
      : null

  return {
    id,
    receiptId,
    createdAt,
    decision,
    confidence,
    reasoningProvider,
    triggeredChecks: checks.map(({ name, result, detail }) => ({ name, result, detail })),
    privateRationale,
    publicSummary,
    treasuryStateSnapshot,
    proposedAction,
    policySetId: typeof entry.policySetId === 'string'
      ? entry.policySetId
      : typeof policySet.id === 'string'
        ? policySet.id
        : null,
    policySet: {
      id: policySet.id,
      name: policySet.name,
      status: policySet.status as StoredEvaluation['policySet']['status'],
    },
    policySnapshot: policySnapshot as StoredEvaluation['policySnapshot'],
    submittedByAddress: typeof entry.submittedByAddress === 'string' ? entry.submittedByAddress : null,
    submittedByDisplay: typeof entry.submittedByDisplay === 'string' ? entry.submittedByDisplay : null,
    receiptHash,
    checks,
    receipt: {
      receiptId,
      hash: receiptHash,
      urls: {
        receiptJson: typeof urls?.receiptJson === 'string' ? urls.receiptJson : buildHostedArtifactUrls(receiptId).receiptJson,
        agentJson: typeof urls?.agentJson === 'string' ? urls.agentJson : buildHostedArtifactUrls(receiptId).agentJson,
        agentLog: typeof urls?.agentLog === 'string' ? urls.agentLog : buildHostedArtifactUrls(receiptId).agentLog,
      },
    },
  }
}

async function persistStore(store: EvaluationStoreFile) {
  await mkdir(dirname(STORE_FILE), { recursive: true })

  const tempFile = `${STORE_FILE}.tmp`
  await writeFile(tempFile, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  await rename(tempFile, STORE_FILE)
}

async function loadStore() {
  if (cachedStore) {
    return cachedStore
  }

  if (activeRead) {
    return activeRead
  }

  activeRead = (async () => {
    try {
      const rawStore = await readFile(STORE_FILE, 'utf8')
      const parsed = JSON.parse(rawStore) as { version?: number; evaluations?: unknown[] }

      if (!Array.isArray(parsed.evaluations)) {
        cachedStore = createEmptyStore()
        return cachedStore
      }

      cachedStore = {
        version: typeof parsed.version === 'number' ? parsed.version : STORE_VERSION,
        evaluations: parsed.evaluations
          .map((entry) => normalizeEvaluation(entry))
          .filter((entry): entry is StoredEvaluation => Boolean(entry))
          .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
      }

      return cachedStore
    } catch (error) {
      const isMissingFile = error instanceof Error && 'code' in error && error.code === 'ENOENT'

      if (isMissingFile) {
        cachedStore = createEmptyStore()
        return cachedStore
      }

      throw error
    } finally {
      activeRead = null
    }
  })()

  return activeRead
}

function enqueueWrite<T>(operation: () => Promise<T>) {
  const nextOperation = writeQueue.then(operation, operation)
  writeQueue = nextOperation.then(
    () => undefined,
    () => undefined,
  )

  return nextOperation
}

function getRequestState(request: DemoEvaluationRequest) {
  const candidate = request as Record<string, unknown>

  return 'treasuryState' in request && typeof request.treasuryState === 'string'
    ? request.treasuryState
    : typeof candidate.state === 'string'
      ? candidate.state
      : ''
}

function getRequestAction(request: DemoEvaluationRequest) {
  const candidate = request as Record<string, unknown>

  return 'proposedAction' in request && typeof request.proposedAction === 'string'
    ? request.proposedAction
    : typeof candidate.action === 'string'
      ? candidate.action
      : ''
}

export async function listPersistedEvaluations() {
  const store = await loadStore()
  return store.evaluations
}

export async function getPersistedEvaluation(id: string) {
  const store = await loadStore()
  return store.evaluations.find((evaluation) => evaluation.id === id) ?? null
}

export async function getPersistedEvaluationByReceiptId(receiptId: string) {
  const store = await loadStore()
  return store.evaluations.find((evaluation) => evaluation.receiptId === receiptId || evaluation.receipt.receiptId === receiptId) ?? null
}

export async function savePersistedEvaluation(input: {
  createdAt?: string
  request: DemoEvaluationRequest
  response: DemoEvaluationResponse
  submittedByAddress?: string | null
  submittedByLabel?: string | null
}) {
  return enqueueWrite(async () => {
    const currentStore = await loadStore()
    const receiptId = input.response.receipt.receiptId ?? `AEGIS-${randomUUID()}`
    const receiptHash = input.response.receipt.hash ?? null
    const createdAt = input.createdAt ?? new Date().toISOString()
    const checks = input.response.triggeredChecks.map((check, index) => ({
      id: `${receiptId}-check-${index + 1}`,
      evaluationId: receiptId,
      name: check.name,
      result: check.result,
      detail: check.detail,
    })) satisfies EvaluationCheckRecord[]

    const record: StoredEvaluation = {
      ...input.response,
      id: receiptId,
      receiptId,
      createdAt,
      treasuryStateSnapshot: getRequestState(input.request),
      proposedAction: getRequestAction(input.request),
      policySetId: 'policySetId' in input.request && typeof input.request.policySetId === 'string'
        ? input.request.policySetId
        : input.response.policySet.id,
      submittedByAddress: input.submittedByAddress ?? null,
      submittedByDisplay: input.submittedByLabel ?? null,
      receiptHash,
      checks,
      receipt: {
        receiptId,
        hash: receiptHash,
        urls: input.response.receipt.urls ?? buildHostedArtifactUrls(receiptId),
      },
    }

    const nextStore: EvaluationStoreFile = {
      version: currentStore.version || STORE_VERSION,
      evaluations: [record, ...currentStore.evaluations.filter((evaluation) => evaluation.id !== record.id)]
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt)),
    }

    cachedStore = nextStore
    await persistStore(nextStore)

    return record
  })
}
