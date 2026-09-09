import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FieldLabel, TextArea, UnderlinedSelectInput, UnderlinedTextArea, UnderlinedTextInput } from '~/components/ui/field'
import { Icon } from '~/components/ui/icon'
import { MetricCard } from '~/components/ui/metric-card'
import { demoEvaluationDraft, treasuryMetrics } from '~/content/aegis'
import { fetchPolicySets, submitDemoEvaluation, type PolicySetRecord } from '~/lib/api'
import { getPolicySummaryItems } from '~/lib/policies'

export const Route = createFileRoute('/evaluation-dashboard')({
  component: EvaluationDashboardPage,
})

const assetRows = [
  { name: 'Ethereum', symbol: 'ETH', balance: '8,420 ETH', value: '$18,242,100', allocation: 42, accent: '#627eea' },
  { name: 'USD Coin', symbol: 'USDC', balance: '11,402,182 USDC', value: '$11,402,182', allocation: 27, accent: '#2775ca' },
  { name: 'Lido stETH', symbol: 'st', balance: '4,138 stETH', value: '$8,994,221', allocation: 21, accent: '#00a3ff' },
  { name: 'Base Ecosystem', symbol: 'B', balance: 'Strategic Program', value: '$4,252,537', allocation: 10, accent: '#2dd4bf' },
] as const

const assetOptions = ['Wrapped Ethereum (WETH)', 'USD Coin (USDC)', 'Lido stETH'] as const

function deriveActionComposer(action: string) {
  const amountMatch = action.match(/(\d+[\d,.]*)\s*(ETH|WETH|USDC|stETH)/i)
  const destinationMatch = action.match(/to\s+([^.,\n]+)/i)

  return {
    amount: amountMatch?.[1] ?? '450',
    asset: action.includes('stable') ? 'USD Coin (USDC)' : 'Wrapped Ethereum (WETH)',
    destination: destinationMatch?.[1]?.trim() ?? 'Base MM Program',
    reason: 'Deepen protocol liquidity while preserving runway and concentration thresholds.',
  }
}

function EvaluationDashboardPage() {
  const navigate = useNavigate()
  const [treasuryState, setTreasuryState] = useState(demoEvaluationDraft.treasuryState)
  const [actionComposer, setActionComposer] = useState(() => deriveActionComposer(demoEvaluationDraft.proposedAction))
  const [policySets, setPolicySets] = useState<PolicySetRecord[]>([])
  const [selectedPolicySetId, setSelectedPolicySetId] = useState('')
  const [isPolicyLoading, setIsPolicyLoading] = useState(true)
  const [policyErrorMessage, setPolicyErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    setIsPolicyLoading(true)
    setPolicyErrorMessage(null)

    fetchPolicySets()
      .then((records) => {
        if (isCancelled) {
          return
        }

        setPolicySets(records)
        const nextActive = records.find((policy) => policy.status === 'active') ?? records.find((policy) => policy.status !== 'archived') ?? null
        setSelectedPolicySetId((current) => {
          if (current && records.some((policy) => policy.id === current && policy.status !== 'archived')) {
            return current
          }

          return nextActive?.id ?? ''
        })
      })
      .catch((error) => {
        if (!isCancelled) {
          setPolicySets([])
          setPolicyErrorMessage(error instanceof Error ? error.message : 'Unable to load policy sets right now.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsPolicyLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const availablePolicySets = useMemo(
    () => policySets.filter((policy) => policy.status !== 'archived'),
    [policySets],
  )

  const activePolicy = useMemo(
    () => policySets.find((policy) => policy.status === 'active') ?? availablePolicySets[0] ?? null,
    [availablePolicySets, policySets],
  )

  const selectedPolicy = useMemo(
    () => availablePolicySets.find((policy) => policy.id === selectedPolicySetId) ?? activePolicy,
    [activePolicy, availablePolicySets, selectedPolicySetId],
  )

  const selectedPolicySummary = selectedPolicy ? getPolicySummaryItems(selectedPolicy.resolved) : []
  const activePolicySummary = activePolicy ? getPolicySummaryItems(activePolicy.resolved).slice(0, 3) : []

  function updateActionField<K extends keyof typeof actionComposer>(key: K, value: (typeof actionComposer)[K]) {
    setActionComposer((current) => ({ ...current, [key]: value }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)

    if (!selectedPolicy) {
      setErrorMessage(policyErrorMessage ?? 'No active policy set is available for evaluation.')
      return
    }

    setIsSubmitting(true)

    const composedAction = `${actionComposer.reason.trim()} Transfer ${actionComposer.amount || '0'} ${actionComposer.asset} to ${actionComposer.destination || 'the specified destination'} while keeping stablecoin runway intact.`

    try {
      const response = await submitDemoEvaluation({
        policySetId: selectedPolicy.id,
        treasuryState,
        proposedAction: composedAction,
      })

      await navigate({
        to: '/decision-result',
        search: response.receipt.receiptId ? { evaluation: response.receipt.receiptId } : undefined,
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to evaluate this treasury action right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setTreasuryState(demoEvaluationDraft.treasuryState)
    setActionComposer(deriveActionComposer(demoEvaluationDraft.proposedAction))
    setSelectedPolicySetId(activePolicy?.id ?? '')
    setErrorMessage(null)
  }

  return (
    <ConsoleLayout
      eyebrow="Private cognition and policy enforcement"
      title="Treasury Intelligence"
      description="The evaluator now resolves a real structured policy set on the server, persists the policy snapshot used for each decision, and keeps the just-submitted review path alive in the originating browser session when multi-instance demo hosting drops local runtime history."
      contentClassName="max-w-[1400px]"
      topbarActions={
        <>
          <Badge tone="primary">Live MVP</Badge>
          <Badge tone="info">Judge start here</Badge>
        </>
      }
      actions={
        <>
          <Link to="/evaluation-history" className="inline-flex">
            <Button variant="secondary">Open history</Button>
          </Link>
          <Link to="/policy-management" className="inline-flex">
            <Button>Manage policies</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <section className="rounded-2xl border border-aegis-primary/15 bg-aegis-primary/8 p-5 text-sm leading-7 text-aegis-text-muted">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="primary">Submission-critical route</Badge>
              <Badge tone="info">Durable history</Badge>
              <Badge tone="neutral">Structured policies live</Badge>
            </div>
            <p className="mt-4">
              Use the <span className="font-semibold text-aegis-text">Propose Action</span> panel to evaluate against the active or selected structured policy set. Aegis now stores the resolved policy snapshot with each persisted result so prior decisions stay historically correct after edits.
            </p>
          </section>

          <div className="grid gap-6 md:grid-cols-3">
            {treasuryMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <section className="dashboard-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/6 px-6 py-5">
              <div>
                <h2 className="font-headline text-lg font-bold text-aegis-text">Current Asset State</h2>
                <p className="mt-1 text-sm text-aegis-text-muted">Illustrative treasury snapshot used to preserve the Stitch dashboard layout around the live evaluator.</p>
              </div>
              <Button variant="ghost" disabled type="button">Analytics coming soon</Button>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.2em] text-aegis-text-muted/55">
                    <th className="px-4 py-3">Asset Name</th>
                    <th className="px-4 py-3">Balance</th>
                    <th className="px-4 py-3">Value (USD)</th>
                    <th className="px-4 py-3 text-right">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {assetRows.map((row) => (
                    <tr key={row.name} className="dashboard-table-row">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: row.accent }}>
                            {row.symbol}
                          </div>
                          <span className="font-medium text-aegis-text">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-aegis-text-muted">{row.balance}</td>
                      <td className="px-4 py-4 text-sm text-aegis-text">{row.value}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-xs text-aegis-text-muted">{row.allocation}%</span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-aegis-highest">
                            <div className="h-full bg-aegis-primary" style={{ width: `${row.allocation}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <article className="dashboard-card p-6 md:col-span-2">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Active policy summary</div>
                  <h3 className="mt-2 font-headline text-2xl font-bold text-aegis-text">{activePolicy?.name ?? 'Loading policy set'}</h3>
                </div>
                {activePolicy ? <Badge tone="primary">Active</Badge> : null}
              </div>
              <p className="text-sm leading-7 text-aegis-text-muted">{activePolicy?.description ?? (policyErrorMessage || 'Aegis is resolving the current active policy set for evaluation.')}</p>
              {activePolicySummary.length ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {activePolicySummary.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/8 bg-black/20 p-4">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-aegis-text-muted">{item.label}</div>
                      <div className="mt-2 text-sm font-semibold text-aegis-text">{item.value}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </article>

            <article className="dashboard-card flex min-h-[220px] flex-col items-start justify-between p-6">
              <div>
                <div className="grid h-11 w-11 place-items-center rounded-lg bg-aegis-primary/10 text-aegis-primary">
                  <Icon name="gavel" className="text-xl" />
                </div>
                <h3 className="mt-5 font-headline text-xl font-bold text-aegis-text">Policy workspace</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">Create, edit, activate, and archive structured policy sets without falling back to freeform policy text.</p>
              </div>
              <Link to="/policy-management" className="inline-flex">
                <Button variant="secondary">Open policy management</Button>
              </Link>
            </article>
          </section>
        </div>

        <div className="xl:col-span-4 xl:row-span-2">
          <section className="surface-glass h-full rounded-xl border border-white/10 p-8 shadow-2xl shadow-black/30">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-aegis-text">Propose Action</h2>
              <Icon name="bolt" className="text-2xl text-aegis-primary" />
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-xl border border-aegis-primary/15 bg-aegis-primary/8 p-4">
                <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Evaluating against:</div>
                <div className="mt-2 font-headline text-2xl font-bold text-aegis-text">
                  {selectedPolicy?.name ?? (isPolicyLoading ? 'Loading policy set...' : 'No policy set available')}
                </div>
                <p className="mt-2 text-sm leading-6 text-aegis-text-muted">
                  {selectedPolicy?.description ?? 'Select a non-archived policy set before running the evaluator.'}
                </p>

                {availablePolicySets.length > 1 ? (
                  <div className="mt-4">
                    <FieldLabel>Policy selector</FieldLabel>
                    <div className="relative mt-2">
                      <UnderlinedSelectInput
                        value={selectedPolicy?.id ?? ''}
                        onChange={(event) => setSelectedPolicySetId(event.target.value)}
                        className="appearance-none pr-8"
                        disabled={isPolicyLoading || !availablePolicySets.length}
                      >
                        {availablePolicySets.map((policy) => (
                          <option key={policy.id} value={policy.id}>
                            {policy.name}
                          </option>
                        ))}
                      </UnderlinedSelectInput>
                      <Icon name="expand_more" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base text-aegis-text-muted" />
                    </div>
                  </div>
                ) : null}

                {selectedPolicySummary.length ? (
                  <div className="mt-4 space-y-2">
                    {selectedPolicySummary.slice(0, 4).map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-3 border-t border-white/6 pt-2 text-sm">
                        <span className="text-aegis-text-muted">{item.label}</span>
                        <span className="text-right font-medium text-aegis-text">{item.value}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div>
                <FieldLabel>Amount</FieldLabel>
                <UnderlinedTextInput
                  value={actionComposer.amount}
                  onChange={(event) => updateActionField('amount', event.target.value)}
                  className="mt-2 text-3xl font-headline font-extrabold tracking-tight"
                  placeholder="0.00"
                />
              </div>

              <div>
                <FieldLabel>Asset</FieldLabel>
                <div className="relative mt-2">
                  <UnderlinedSelectInput
                    value={actionComposer.asset}
                    onChange={(event) => updateActionField('asset', event.target.value as (typeof assetOptions)[number])}
                    className="appearance-none pr-8"
                  >
                    {assetOptions.map((asset) => (
                      <option key={asset} value={asset}>
                        {asset}
                      </option>
                    ))}
                  </UnderlinedSelectInput>
                  <Icon name="expand_more" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base text-aegis-text-muted" />
                </div>
              </div>

              <div>
                <FieldLabel>Destination address</FieldLabel>
                <UnderlinedTextInput
                  value={actionComposer.destination}
                  onChange={(event) => updateActionField('destination', event.target.value)}
                  className="mt-2 font-mono text-sm"
                  placeholder="0x... or approved destination"
                />
              </div>

              <div>
                <FieldLabel>Strategic reason</FieldLabel>
                <UnderlinedTextArea
                  value={actionComposer.reason}
                  onChange={(event) => updateActionField('reason', event.target.value)}
                  className="mt-2 min-h-24"
                  placeholder="Explain the rationale for this treasury movement..."
                />
              </div>

              <div className="rounded-xl border border-aegis-secondary/15 bg-aegis-secondary/5 p-4 text-sm leading-6 text-aegis-text-muted">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="warning">Private lane</Badge>
                  <Badge tone="info">Public-safe lane</Badge>
                  <Badge tone="neutral">Receipt attached</Badge>
                </div>
                <p className="mt-4">Private reasoning stays confidential, a bounded public-safe summary is generated for review, and the completed evaluation is retained in the server-backed history with the exact policy snapshot used for that run.</p>
              </div>

              {policyErrorMessage ? (
                <div className="rounded-xl border border-aegis-warning/30 bg-aegis-warning/10 px-4 py-3 text-sm text-aegis-text">
                  {policyErrorMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-xl border border-aegis-warning/30 bg-aegis-warning/10 px-4 py-3 text-sm text-aegis-text">
                  {errorMessage}
                </div>
              ) : null}

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || isPolicyLoading || !selectedPolicy}
                  className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  leftIcon={<Icon name={isSubmitting ? 'hourglass_top' : 'play_circle'} className="text-lg" />}
                >
                  {isSubmitting ? 'Evaluating guardrails' : 'Submit evaluation'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleReset}
                >
                  Reset demo inputs
                </Button>
              </div>

              <details className="rounded-xl border border-white/6 bg-black/20 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-aegis-text">
                  Private evaluation context
                  <span className="text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Confidential</span>
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <FieldLabel>Treasury state</FieldLabel>
                    <TextArea
                      value={treasuryState}
                      onChange={(event) => setTreasuryState(event.target.value)}
                      className="mt-2 min-h-24 rounded-lg border-white/6 bg-black/25 text-sm"
                      placeholder="Describe reserves, runway, concentration, and operator context."
                    />
                  </div>
                  <p className="text-xs leading-6 text-aegis-text-muted">
                    Structured policy rules are resolved server-side from the selected policy set. Completed runs persist the policy snapshot, decision, and hosted artifact URLs in the local server store.
                  </p>
                </div>
              </details>
            </form>
          </section>
        </div>
      </div>
    </ConsoleLayout>
  )
}
