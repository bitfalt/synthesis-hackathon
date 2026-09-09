import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import {
  buildPolicyRules,
  defaultPolicyRules,
  hydratePolicySet,
  type PolicyRule,
  type PolicySet,
  type PolicySetRecord,
  type PolicySetWriteInput,
} from '~/lib/policies'

type PolicyStoreFile = {
  policySets: PolicySet[]
  policyRules: PolicyRule[]
}

const RUNTIME_ROOT = process.env.VERCEL ? path.join(tmpdir(), 'aegis-runtime') : process.cwd()
const STORE_FILE_PATH = process.env.VERCEL
  ? path.join(RUNTIME_ROOT, 'policy-sets.json')
  : path.join(RUNTIME_ROOT, '.aegis-runtime', 'policy-sets.json')

export async function listPolicySets() {
  const store = await loadPolicyStore()
  return mapPolicySets(store)
}

export async function getPolicySet(policySetId: string) {
  const policies = await listPolicySets()
  return policies.find((policy) => policy.id === policySetId) ?? null
}

export async function getActivePolicySet() {
  const policies = await listPolicySets()
  return policies.find((policy) => policy.status === 'active') ?? policies.find((policy) => policy.status !== 'archived') ?? null
}

export async function createPolicySet(input: PolicySetWriteInput) {
  const store = await loadPolicyStore()
  const now = new Date().toISOString()
  const policySetId = `policy-${randomUUID()}`
  const policySet: PolicySet = {
    id: policySetId,
    name: input.name,
    description: input.description,
    status: 'draft',
    isDefault: false,
    createdAt: now,
    updatedAt: now,
    createdByAddress: input.createdByAddress ?? null,
    updatedByAddress: input.updatedByAddress ?? null,
  }

  store.policySets.push(policySet)
  store.policyRules.push(...buildPolicyRules(policySetId, input.rules))
  await savePolicyStore(store)

  return getRequiredPolicySet(store, policySetId)
}

export async function updatePolicySet(policySetId: string, input: PolicySetWriteInput) {
  const store = await loadPolicyStore()
  const policySet = store.policySets.find((entry) => entry.id === policySetId)

  if (!policySet) {
    return null
  }

  if (policySet.status === 'archived') {
    throw new Error('Archived policies cannot be edited.')
  }

  policySet.name = input.name
  policySet.description = input.description
  policySet.updatedAt = new Date().toISOString()
  policySet.updatedByAddress = input.updatedByAddress ?? input.createdByAddress ?? policySet.updatedByAddress

  store.policyRules = store.policyRules.filter((rule) => rule.policySetId !== policySetId)
  store.policyRules.push(...buildPolicyRules(policySetId, input.rules))

  await savePolicyStore(store)
  return getRequiredPolicySet(store, policySetId)
}

export async function activatePolicySet(policySetId: string, updatedByAddress?: string | null) {
  const store = await loadPolicyStore()
  const target = store.policySets.find((entry) => entry.id === policySetId)

  if (!target || target.status === 'archived') {
    return null
  }

  const now = new Date().toISOString()

  for (const policy of store.policySets) {
    if (policy.id === policySetId) {
      policy.status = 'active'
      policy.updatedAt = now
      policy.updatedByAddress = updatedByAddress ?? policy.updatedByAddress
      continue
    }

    if (policy.status === 'active') {
      policy.status = 'draft'
      policy.updatedAt = now
      policy.updatedByAddress = updatedByAddress ?? policy.updatedByAddress
    }
  }

  await savePolicyStore(store)
  return getRequiredPolicySet(store, policySetId)
}

export async function archivePolicySet(policySetId: string, updatedByAddress?: string | null) {
  const store = await loadPolicyStore()
  const target = store.policySets.find((entry) => entry.id === policySetId)

  if (!target) {
    return null
  }

  const remaining = store.policySets.filter((entry) => entry.id !== policySetId && entry.status !== 'archived')

  if (!remaining.length) {
    throw new Error('At least one non-archived policy set must remain available.')
  }

  const now = new Date().toISOString()
  const wasActive = target.status === 'active'

  target.status = 'archived'
  target.updatedAt = now
  target.updatedByAddress = updatedByAddress ?? target.updatedByAddress

  if (wasActive) {
    const fallback = chooseFallbackPolicy(store.policySets, policySetId)

    if (!fallback) {
      throw new Error('A fallback active policy set could not be resolved.')
    }

    fallback.status = 'active'
    fallback.updatedAt = now
    fallback.updatedByAddress = updatedByAddress ?? fallback.updatedByAddress
  }

  await savePolicyStore(store)
  return getRequiredPolicySet(store, policySetId)
}

async function loadPolicyStore(): Promise<PolicyStoreFile> {
  try {
    const raw = await readFile(STORE_FILE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as PolicyStoreFile

    if (!Array.isArray(parsed.policySets) || !Array.isArray(parsed.policyRules)) {
      throw new Error('Invalid policy store payload.')
    }

    return parsed
  } catch (error) {
    const store = createSeedPolicyStore()
    await savePolicyStore(store)

    if (error instanceof Error && 'code' in error && error.code !== 'ENOENT') {
      return store
    }

    return store
  }
}

async function savePolicyStore(store: PolicyStoreFile) {
  await mkdir(path.dirname(STORE_FILE_PATH), { recursive: true })
  await writeFile(STORE_FILE_PATH, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
}

function mapPolicySets(store: PolicyStoreFile) {
  return store.policySets
    .map((policySet) => hydratePolicySet(policySet, store.policyRules.filter((rule) => rule.policySetId === policySet.id)))
    .sort(comparePolicySets)
}

function getRequiredPolicySet(store: PolicyStoreFile, policySetId: string): PolicySetRecord {
  const policy = mapPolicySets(store).find((entry) => entry.id === policySetId)

  if (!policy) {
    throw new Error(`Policy set ${policySetId} was not found after mutation.`)
  }

  return policy
}

function chooseFallbackPolicy(policySets: PolicySet[], archivedPolicyId: string) {
  return [...policySets]
    .filter((entry) => entry.id !== archivedPolicyId && entry.status !== 'archived')
    .sort((left, right) => {
      if (left.isDefault !== right.isDefault) {
        return left.isDefault ? -1 : 1
      }

      return right.updatedAt.localeCompare(left.updatedAt)
    })[0] ?? null
}

function comparePolicySets(left: PolicySetRecord, right: PolicySetRecord) {
  const order = { active: 0, draft: 1, archived: 2 }

  if (order[left.status] !== order[right.status]) {
    return order[left.status] - order[right.status]
  }

  return right.updatedAt.localeCompare(left.updatedAt)
}

function createSeedPolicyStore(): PolicyStoreFile {
  const now = new Date().toISOString()
  const policySetId = 'policy-core-baseline'
  const policySet: PolicySet = {
    id: policySetId,
    name: 'Core Treasury Baseline',
    description: 'Default structured guardrails for treasury runway, transfer review, and destination restrictions.',
    status: 'active',
    isDefault: true,
    createdAt: now,
    updatedAt: now,
    createdByAddress: null,
    updatedByAddress: null,
  }

  return {
    policySets: [policySet],
    policyRules: buildPolicyRules(policySetId, defaultPolicyRules),
  }
}
