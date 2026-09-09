import { Link, useNavigate } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FieldLabel, TextArea, TextInput } from '~/components/ui/field'
import { Icon } from '~/components/ui/icon'
import {
  activatePolicySet,
  archivePolicySet,
  createPolicySet,
  fetchPolicySets,
  formatEvaluationTimestamp,
  updatePolicySet,
  type PolicySetPayload,
  type PolicySetRecord,
  shortenAddress,
} from '~/lib/api'
import { useOperatorIdentityFlow } from '~/lib/operator-auth-client'
import { getPolicyStatusLabel, getPolicyStatusTone, getPolicySummaryItems } from '~/lib/policies'

type PolicyFilter = 'active' | 'draft' | 'archived'

type PolicyFormState = PolicySetPayload

type ModalState =
  | { mode: 'create'; policy: null }
  | { mode: 'edit'; policy: PolicySetRecord }

const defaultFormState: PolicyFormState = {
  name: '',
  description: '',
  rules: {
    runwayMonthsMin: 18,
    ethReviewThreshold: 400,
    stableReviewThreshold: 500000,
    assetConcentrationMaxPercent: 50,
    blockedCounterpartyCategories: ['unapproved bridge', 'sanctioned', 'unverified otc broker'],
  },
}

export function PolicyManagementContent({ showModal = false }: { showModal?: boolean }) {
  const navigate = useNavigate()
  const identity = useOperatorIdentityFlow()
  const [policySets, setPolicySets] = useState<PolicySetRecord[]>([])
  const [filter, setFilter] = useState<PolicyFilter>('active')
  const [modalState, setModalState] = useState<ModalState | null>(showModal ? { mode: 'create', policy: null } : null)
  const [formState, setFormState] = useState<PolicyFormState>(defaultFormState)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [busyPolicyId, setBusyPolicyId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    void loadPolicies()
  }, [])

  useEffect(() => {
    if (showModal) {
      setModalState({ mode: 'create', policy: null })
      setFormState(defaultFormState)
    }
  }, [showModal])

  const counts = useMemo(() => ({
    active: policySets.filter((policy) => policy.status === 'active').length,
    draft: policySets.filter((policy) => policy.status === 'draft').length,
    archived: policySets.filter((policy) => policy.status === 'archived').length,
  }), [policySets])

  const activePolicy = useMemo(
    () => policySets.find((policy) => policy.status === 'active') ?? policySets.find((policy) => policy.status !== 'archived') ?? null,
    [policySets],
  )

  const filteredPolicySets = useMemo(
    () => policySets.filter((policy) => policy.status === filter),
    [filter, policySets],
  )
  const canMutatePolicies = identity.hasMatchingSession && !identity.isWrongNetwork

  async function loadPolicies() {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const records = await fetchPolicySets()
      setPolicySets(records)
    } catch (error) {
      setPolicySets([])
      setErrorMessage(error instanceof Error ? error.message : 'Unable to load policy sets right now.')
    } finally {
      setIsLoading(false)
    }
  }

  function openCreateModal() {
    if (!canMutatePolicies) {
      setErrorMessage('Sign in as a Base operator before creating policy sets.')
      return
    }

    setErrorMessage(null)
    setModalState({ mode: 'create', policy: null })
    setFormState(defaultFormState)
  }

  function openEditModal(policy: PolicySetRecord) {
    if (!canMutatePolicies) {
      setErrorMessage('Sign in as a Base operator before editing policy sets.')
      return
    }

    setErrorMessage(null)
    setModalState({ mode: 'edit', policy })
    setFormState({
      name: policy.name,
      description: policy.description,
      rules: {
        runwayMonthsMin: policy.resolved.runwayMonthsMin,
        ethReviewThreshold: policy.resolved.ethReviewThreshold,
        stableReviewThreshold: policy.resolved.stableReviewThreshold,
        assetConcentrationMaxPercent: policy.resolved.assetConcentrationMaxPercent,
        blockedCounterpartyCategories: policy.resolved.blockedCounterpartyCategories.length
          ? [...policy.resolved.blockedCounterpartyCategories]
          : [''],
      },
    })
  }

  async function closeModal() {
    setModalState(null)
    setErrorMessage(null)

    if (showModal) {
      await navigate({ to: '/policy-management' })
    }
  }

  async function handleSave() {
    if (!modalState) {
      return
    }

    if (!canMutatePolicies) {
      setErrorMessage('Sign in as a Base operator before saving policy changes.')
      return
    }

    setIsSaving(true)
    setErrorMessage(null)

    const payload: PolicySetPayload = {
      ...formState,
      rules: {
        ...formState.rules,
        blockedCounterpartyCategories: formState.rules.blockedCounterpartyCategories.map((value) => value.trim()).filter(Boolean),
      },
    }

    try {
      if (modalState.mode === 'create') {
        await createPolicySet(payload)
        setFilter('draft')
      } else {
        await updatePolicySet(modalState.policy.id, payload)
      }

      await loadPolicies()
      await closeModal()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to save this policy set right now.')
    } finally {
      setIsSaving(false)
    }
  }

  async function handleActivate(policy: PolicySetRecord) {
    if (!canMutatePolicies) {
      setErrorMessage('Sign in as a Base operator before activating policy sets.')
      return
    }

    setBusyPolicyId(policy.id)
    setErrorMessage(null)

    try {
      await activatePolicySet(policy.id)
      await loadPolicies()
      setFilter('active')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to activate this policy set right now.')
    } finally {
      setBusyPolicyId(null)
    }
  }

  async function handleArchive(policy: PolicySetRecord) {
    if (!canMutatePolicies) {
      setErrorMessage('Sign in as a Base operator before archiving policy sets.')
      return
    }

    setBusyPolicyId(policy.id)
    setErrorMessage(null)

    try {
      await archivePolicySet(policy.id)
      await loadPolicies()
      setFilter('archived')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to archive this policy set right now.')
    } finally {
      setBusyPolicyId(null)
    }
  }

  function updateBlockedCategory(index: number, value: string) {
    setFormState((current) => ({
      ...current,
      rules: {
        ...current.rules,
        blockedCounterpartyCategories: current.rules.blockedCounterpartyCategories.map((entry, entryIndex) => entryIndex === index ? value : entry),
      },
    }))
  }

  function addBlockedCategory() {
    setFormState((current) => ({
      ...current,
      rules: {
        ...current.rules,
        blockedCounterpartyCategories: [...current.rules.blockedCounterpartyCategories, ''],
      },
    }))
  }

  function removeBlockedCategory(index: number) {
    setFormState((current) => ({
      ...current,
      rules: {
        ...current.rules,
        blockedCounterpartyCategories: current.rules.blockedCounterpartyCategories.filter((_, entryIndex) => entryIndex !== index),
      },
    }))
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-aegis-primary/20 bg-aegis-primary/8 p-5 text-sm leading-7 text-aegis-text-muted">
        <div className="flex flex-wrap items-center gap-2">
          <span className="badge badge-primary">Live structured policies</span>
          <span className="badge badge-info">Evaluator wired</span>
          <span className="badge badge-neutral">Snapshots persisted</span>
          <span className={`badge ${canMutatePolicies ? 'badge-primary' : 'badge-warning'}`}>{canMutatePolicies ? 'Signed operator active' : 'Operator session required'}</span>
        </div>
        <p className="mt-4">
          Policy management is a live supporting capability in the MVP. Every evaluation resolves the selected policy set on the server and stores the exact policy snapshot used so old decisions remain historically correct after later edits.
        </p>
      </section>

      {!canMutatePolicies ? (
        <section className="rounded-2xl border border-aegis-warning/20 bg-aegis-warning/8 p-5 text-sm leading-7 text-aegis-text-muted">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge tone="warning">Policy mutations blocked</Badge>
                <Badge tone="info">Passive browsing still open</Badge>
              </div>
              <p>
                Create, edit, activate, and archive actions require a signed operator session on Base. Connect a wallet in the top bar, switch to Base if needed, and sign the challenge before mutating policy sets.
              </p>
            </div>
            {identity.isConnected && identity.isWrongNetwork ? (
              <Button type="button" variant="secondary" onClick={() => void identity.switchToBase()} disabled={identity.isSwitchPending}>
                {identity.isSwitchPending ? 'Switching to Base' : 'Switch to Base'}
              </Button>
            ) : identity.isConnected && !identity.hasMatchingSession ? (
              <Button type="button" variant="secondary" onClick={() => void identity.signIn()} disabled={identity.isAuthenticating}>
                {identity.isAuthenticating ? 'Awaiting signature' : 'Sign operator session'}
              </Button>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-12">
        <div className="dashboard-card relative overflow-hidden p-8 xl:col-span-8">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-aegis-primary/5 blur-3xl" />
          <div className="relative z-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="font-headline text-2xl font-bold text-aegis-text">{activePolicy?.name ?? 'No active policy set'}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-aegis-text-muted">
                  {activePolicy?.description ?? 'Create and activate a structured policy set to drive the evaluator.'}
                </p>
              </div>
              {activePolicy ? <Badge tone="primary">Active policy</Badge> : null}
            </div>

            {activePolicy ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {getPolicySummaryItems(activePolicy.resolved).map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/8 bg-black/20 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-aegis-text-muted">{item.label}</div>
                    <div className="mt-2 text-sm font-semibold text-aegis-text">{item.value}</div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl bg-aegis-primary p-8 text-zinc-950 xl:col-span-4">
          <Icon name="bolt" className="mb-4 text-4xl" />
          <h3 className="font-headline text-2xl font-extrabold leading-tight">Structured policy sets control the evaluator</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-900/75">Create a new policy set, activate one as the default, and re-run the same action to verify how threshold edits change future outcomes without rewriting history.</p>
          <div className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900/55">{counts.active} active • {counts.draft} draft • {counts.archived} archived</div>
        </div>
      </section>

      <section className="border-b border-white/6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-8 text-sm">
            {([
              ['active', counts.active],
              ['draft', counts.draft],
              ['archived', counts.archived],
            ] as const).map(([value, count]) => (
              <button
                key={value}
                className={filter === value ? 'border-b-2 border-aegis-primary pb-4 font-bold text-aegis-text' : 'pb-4 font-medium text-aegis-text-muted'}
                onClick={() => setFilter(value)}
                type="button"
              >
                {getPolicyStatusLabel(value)} ({count})
              </button>
            ))}
          </div>

          <div className="pb-3">
            <Button leftIcon={<Icon name="add_moderator" className="text-base" />} onClick={openCreateModal} disabled={!canMutatePolicies}>Create policy set</Button>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <section className="rounded-2xl border border-aegis-warning/20 bg-aegis-warning/8 px-5 py-4 text-sm text-aegis-text">
          {errorMessage}
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="grid grid-cols-12 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted/65">
          <div className="col-span-12 md:col-span-4">Policy set</div>
          <div className="col-span-4 hidden md:block">Key thresholds</div>
          <div className="col-span-2 hidden md:block">Status</div>
          <div className="col-span-2 hidden md:block">Updated</div>
        </div>

        {isLoading ? (
          <article className="dashboard-card px-6 py-8 text-sm text-aegis-text-muted">Loading structured policy sets...</article>
        ) : filteredPolicySets.length ? (
          filteredPolicySets.map((policy) => {
            const summary = getPolicySummaryItems(policy.resolved)
            const isBusy = busyPolicyId === policy.id

            return (
              <article key={policy.id} className="grid grid-cols-1 gap-5 bg-aegis-panel px-6 py-6 md:grid-cols-12 md:items-center">
                <div className="md:col-span-4">
                  <div className="flex items-center gap-4">
                    <div className="grid h-10 w-10 place-items-center bg-black/25 text-aegis-primary">
                      <Icon name={policy.status === 'archived' ? 'inventory_2' : policy.status === 'active' ? 'verified_user' : 'edit_document'} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-aegis-text">{policy.name}</div>
                      <div className="mt-1 text-xs text-aegis-text-muted">{policy.id}</div>
                      <div className="mt-2 max-w-xl text-xs leading-6 text-aegis-text-muted">{policy.description}</div>
                      <div className="mt-2 text-[11px] text-aegis-text-muted/70">
                        {policy.updatedByAddress ? `Updated by ${shortenAddress(policy.updatedByAddress)}` : 'No operator wallet recorded yet'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 md:col-span-4">
                  {summary.slice(0, 3).map((item) => (
                    <div key={item.label} className="text-xs text-aegis-text-muted">
                      <span className="font-semibold text-aegis-text">{item.label}:</span> {item.value}
                    </div>
                  ))}
                </div>

                <div className="md:col-span-2">
                  <Badge tone={getPolicyStatusTone(policy.status)}>{getPolicyStatusLabel(policy.status)}</Badge>
                </div>

                <div className="md:col-span-1 text-sm text-aegis-text-muted">
                  {formatEvaluationTimestamp(policy.updatedAt)}
                </div>

                <div className="flex flex-wrap justify-end gap-2 md:col-span-1 md:flex-col">
                  {policy.status !== 'archived' ? (
                    <button className="rounded-lg p-2 text-aegis-text-muted transition-colors hover:bg-white/[0.04] hover:text-aegis-text disabled:cursor-not-allowed disabled:opacity-40" onClick={() => openEditModal(policy)} type="button" disabled={!canMutatePolicies}>
                      <Icon name="edit" />
                    </button>
                  ) : null}
                  {policy.status !== 'active' && policy.status !== 'archived' ? (
                    <button className="rounded-lg p-2 text-aegis-primary transition-colors hover:bg-aegis-primary/10 disabled:cursor-not-allowed disabled:opacity-40" disabled={isBusy || !canMutatePolicies} onClick={() => void handleActivate(policy)} type="button">
                      <Icon name="rocket_launch" />
                    </button>
                  ) : null}
                  {policy.status !== 'archived' ? (
                    <button className="rounded-lg p-2 text-aegis-warning transition-colors hover:bg-aegis-warning/10 disabled:cursor-not-allowed disabled:opacity-40" disabled={isBusy || !canMutatePolicies} onClick={() => void handleArchive(policy)} type="button">
                      <Icon name="archive" />
                    </button>
                  ) : null}
                </div>
              </article>
            )
          })
        ) : (
          <article className="dashboard-card px-6 py-8 text-sm text-aegis-text-muted">
            No {filter} policy sets yet.
          </article>
        )}
      </section>

      <section className="dashboard-card flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-12">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Evaluator wiring</p>
            <div className="flex items-center gap-2 text-sm text-aegis-text-muted">
              <Icon name="cloud_done" className="text-aegis-primary" />
              <span>Server resolves the active or selected policy set before every run</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Historical correctness</p>
            <div className="text-sm text-aegis-text-muted">Each evaluation stores a resolved policy snapshot so old results stay stable after edits</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link to="/evaluation-dashboard" className="inline-flex">
            <Button variant="secondary">Open evaluator</Button>
          </Link>
          <Button onClick={openCreateModal} disabled={!canMutatePolicies}>Create policy set</Button>
        </div>
      </section>

      {modalState ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="surface-glass relative w-full max-w-3xl overflow-hidden rounded-lg border border-white/10 shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between px-8 pb-6 pt-8">
              <div>
                <h3 className="font-headline text-2xl font-bold tracking-tight text-aegis-text">
                  {modalState.mode === 'create' ? 'Create policy set' : 'Edit policy set'}
                </h3>
                <p className="mt-1 text-xs text-aegis-text-muted">Use structured guardrails only. No freeform rule editor is exposed in the MVP.</p>
              </div>
              <button className="rounded-lg p-2 text-aegis-text-muted transition-colors hover:text-aegis-text" onClick={() => void closeModal()} type="button">
                <Icon name="close" />
              </button>
            </div>

            <form className="space-y-8 px-8 pb-10" onSubmit={(event) => { event.preventDefault(); void handleSave() }}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 md:col-span-2">
                  <FieldLabel>Policy set name</FieldLabel>
                  <TextInput value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} placeholder="Conservative Treasury Policy" />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <FieldLabel>Description</FieldLabel>
                  <TextArea value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} className="min-h-24" placeholder="Explain what this policy set optimizes for." />
                </div>

                <NumberRuleField label="Runway minimum (months)" value={formState.rules.runwayMonthsMin} onChange={(value) => setFormState((current) => ({ ...current, rules: { ...current.rules, runwayMonthsMin: value } }))} />
                <NumberRuleField label="ETH review threshold" value={formState.rules.ethReviewThreshold} onChange={(value) => setFormState((current) => ({ ...current, rules: { ...current.rules, ethReviewThreshold: value } }))} />
                <NumberRuleField label="Stable review threshold" value={formState.rules.stableReviewThreshold} onChange={(value) => setFormState((current) => ({ ...current, rules: { ...current.rules, stableReviewThreshold: value } }))} />
                <NumberRuleField label="Asset concentration max (%)" value={formState.rules.assetConcentrationMaxPercent} onChange={(value) => setFormState((current) => ({ ...current, rules: { ...current.rules, assetConcentrationMaxPercent: value } }))} />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <FieldLabel>Blocked counterparty categories</FieldLabel>
                  <button className="text-sm font-semibold text-aegis-primary" onClick={addBlockedCategory} type="button">Add category</button>
                </div>

                <div className="space-y-3">
                  {formState.rules.blockedCounterpartyCategories.map((category, index) => (
                    <div key={`blocked-category-${index + 1}`} className="flex items-center gap-3">
                      <TextInput value={category} onChange={(event) => updateBlockedCategory(index, event.target.value)} placeholder="e.g. unapproved bridge" />
                      <button className="rounded-lg p-2 text-aegis-text-muted transition-colors hover:text-aegis-warning" disabled={formState.rules.blockedCounterpartyCategories.length <= 1} onClick={() => removeBlockedCategory(index)} type="button">
                        <Icon name="delete" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-aegis-warning/20 bg-aegis-warning/8 px-4 py-3 text-sm text-aegis-text">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-4">
                <button className="text-sm font-bold uppercase tracking-[0.18em] text-aegis-text-muted transition-colors hover:text-aegis-text" onClick={() => void closeModal()} type="button">
                  Cancel
                </button>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded border border-aegis-primary/10 bg-aegis-primary/5 px-3 py-1">
                    <Icon name="security" className="text-xs text-aegis-primary" />
                    <span className="text-[10px] font-bold uppercase text-aegis-primary">Structured rules only</span>
                  </div>
                  <Button disabled={isSaving || !canMutatePolicies} type="submit">
                    {isSaving ? 'Saving policy set' : modalState.mode === 'create' ? 'Create policy set' : 'Save changes'}
                  </Button>
                </div>
              </div>
            </form>

            <Icon name="lock_reset" className="pointer-events-none absolute -bottom-10 -right-10 text-[150px] text-white/5" />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function NumberRuleField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="space-y-4">
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        inputMode="decimal"
        type="number"
        value={String(value)}
        onChange={(event) => onChange(Number(event.target.value || '0'))}
      />
    </div>
  )
}
