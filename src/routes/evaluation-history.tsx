import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import {
  fetchEvaluationHistory,
  formatEvaluationTimestamp,
  getCheckLabel,
  getCheckTone,
  getDecisionTone,
  getReasoningProviderLabel,
  getReasoningProviderTone,
  shortenAddress,
  type StoredEvaluation,
} from '~/lib/api'

export const Route = createFileRoute('/evaluation-history')({
  validateSearch: z.object({
    selected: z.string().optional(),
  }),
  component: EvaluationHistoryPage,
})

function EvaluationHistoryPage() {
  const search = Route.useSearch()
  const [history, setHistory] = useState<StoredEvaluation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    setIsLoading(true)
    setErrorMessage(null)

    fetchEvaluationHistory()
      .then((evaluations) => {
        if (!isCancelled) {
          setHistory(evaluations)
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setHistory([])
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load evaluation history.')
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      isCancelled = true
    }
  }, [])

  const selected = useMemo(() => {
    if (!history.length) {
      return null
    }

    if (!search.selected) {
      return history[0] ?? null
    }

    return history.find((entry) => entry.id === search.selected) ?? null
  }, [history, search.selected])

  const metrics = useMemo(() => {
    if (!history.length) {
      return [
        { label: 'Total evaluations', value: '0', helper: 'Awaiting first run', tone: 'primary' as const, icon: 'history' },
        { label: 'Blocks prevented', value: '0', helper: 'No incidents yet', tone: 'warning' as const, icon: 'gpp_bad' },
        { label: 'Mean confidence', value: '0%', helper: 'No persisted history', tone: 'neutral' as const, icon: 'verified' },
        { label: 'Operator signed runs', value: '0', helper: 'Anonymous demo only', tone: 'neutral' as const, icon: 'verified_user' },
      ]
    }

    const blocked = history.filter((entry) => entry.decision === 'BLOCK').length
    const average = Math.round(
      history.reduce((sum, entry) => sum + (entry.confidence === 'high' ? 98 : entry.confidence === 'medium' ? 76 : 42), 0) /
        history.length,
    )
    const signedRuns = history.filter((entry) => Boolean(entry.submittedByAddress)).length

    return [
      { label: 'Total evaluations', value: String(history.length).padStart(2, '0'), helper: 'Persisted server records', tone: 'primary' as const, icon: 'trending_up' },
      { label: 'Blocks prevented', value: String(blocked), helper: 'Risk mitigated', tone: 'warning' as const, icon: 'gpp_bad' },
      { label: 'Mean confidence', value: `${average}%`, helper: 'Across durable history', tone: 'neutral' as const, icon: 'verified' },
      { label: 'Operator signed runs', value: String(signedRuns), helper: 'Wallet-attributed submissions', tone: 'neutral' as const, icon: 'verified_user' },
    ]
  }, [history])

  return (
    <ConsoleLayout
      eyebrow="Audit log of completed evaluations"
      title="Evaluation History"
      description="Review persisted server-backed evaluations, inspect the active policy snapshot that was used for each run, and confirm when a signed Base operator was attached to the record."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="info">Durable server history</Badge>}
      actions={
        <>
          <Button variant="secondary" disabled type="button">Filtering coming soon</Button>
          <Button variant="secondary" disabled type="button">CSV export coming soon</Button>
          <Link to="/evaluation-dashboard" className="inline-flex">
            <Button>Run new evaluation</Button>
          </Link>
        </>
      }
    >
      {isLoading ? <HistoryLoadingState /> : history.length ? (
        <div className="space-y-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div key={metric.label} className="dashboard-card p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-aegis-text-muted/60">{metric.label}</div>
                <div className={`mt-4 font-headline text-4xl font-bold tracking-tight ${metric.tone === 'primary' ? 'text-aegis-primary' : metric.tone === 'warning' ? 'text-aegis-danger' : 'text-aegis-text'}`}>
                  {metric.value}
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px] text-aegis-text-muted">
                  <Icon name={metric.icon} className="text-sm" />
                  <span>{metric.helper}</span>
                </div>
              </div>
            ))}
          </div>

          <section className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b border-white/6 bg-aegis-highest/20 text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted/70">
                    <th className="px-6 py-4">Date and time</th>
                    <th className="px-6 py-4">Action / trigger</th>
                    <th className="px-6 py-4">Decision</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4">Receipt ID</th>
                    <th className="px-6 py-4 text-right">Interactions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => {
                    const isSelected = selected?.id === entry.id

                    return (
                      <tr key={entry.id} className={`dashboard-table-row group ${isSelected ? 'bg-aegis-primary/6' : ''}`}>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-aegis-text">{formatEvaluationTimestamp(entry.createdAt)}</div>
                          <div className="mt-1 text-xs text-aegis-text-muted/60">Persisted server record</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Icon name="swap_horiz" className="text-aegis-secondary" />
                            <div>
                              <div className="text-sm font-semibold text-aegis-text">{entry.publicSummary.split('. ')[0] || 'Treasury evaluation'}</div>
                              <div className="text-[11px] text-aegis-text-muted/70">
                                {entry.submittedByAddress ? `Operator ${shortenAddress(entry.submittedByAddress)}` : 'Anonymous demo submission'}
                              </div>
                              <div className="mt-1 text-[11px] text-aegis-text-muted">Policy: {entry.policySet.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge tone={getDecisionTone(entry.decision)}>{entry.decision}</Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-aegis-highest">
                              <div className="h-full bg-aegis-primary" style={{ width: `${entry.confidence === 'high' ? 98 : entry.confidence === 'medium' ? 76 : 42}%` }} />
                            </div>
                            <span className="text-xs font-mono text-aegis-text">{entry.confidence}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-xs font-mono text-aegis-text-muted underline decoration-dotted underline-offset-4">{entry.receipt.receiptId ?? entry.id}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
                            <Link to="/evaluation-history" search={{ selected: entry.id }} className="inline-flex">
                              <button className="rounded-lg p-2 text-aegis-text-muted hover:bg-white/[0.04] hover:text-aegis-text" type="button">
                                <Icon name="visibility" className="text-sm" />
                              </button>
                            </Link>
                            {entry.receipt.urls?.receiptJson ? (
                              <a href={entry.receipt.urls.receiptJson} target="_blank" rel="noreferrer" className="inline-flex">
                                <button className="rounded-lg p-2 text-aegis-text-muted hover:bg-white/[0.04] hover:text-aegis-text" type="button">
                                  <Icon name="receipt_long" className="text-sm" />
                                </button>
                              </a>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {selected ? <SelectedEvaluationPanel evaluation={selected} /> : <MissingSelectionPanel />}
        </div>
      ) : (
        <section className="dashboard-card max-w-4xl p-8 lg:p-10">
          <div className="mb-6 flex items-center gap-3 text-aegis-primary">
            <Icon name="history" className="text-3xl" />
            <span className="eyebrow">No stored evaluations</span>
          </div>
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">No persisted evaluations yet</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-aegis-text-muted">{errorMessage ?? 'Complete one treasury evaluation from the dashboard and it will appear here immediately, even after a refresh or restart.'}</p>
          <Link to="/evaluation-dashboard" className="mt-8 inline-flex">
            <Button>Open evaluation dashboard</Button>
          </Link>
        </section>
      )}
    </ConsoleLayout>
  )
}

function HistoryLoadingState() {
  return (
    <section className="dashboard-card max-w-4xl p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 text-aegis-primary">
        <Icon name="progress_activity" className="text-3xl" />
        <span className="eyebrow">Loading history</span>
      </div>
      <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">Fetching persisted evaluations</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-aegis-text-muted">Aegis is loading the durable server history so the review log stays correct across refreshes and new tabs.</p>
    </section>
  )
}

function MissingSelectionPanel() {
  return (
    <section className="dashboard-card p-8">
      <h3 className="font-headline text-3xl font-extrabold tracking-tight text-aegis-text">Selected evaluation not found</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-aegis-text-muted">That evaluation is not available in the durable store. Run a new evaluation or choose another stored result.</p>
      <Link to="/evaluation-dashboard" className="mt-8 inline-flex">
        <Button>Run new evaluation</Button>
      </Link>
    </section>
  )
}

function SelectedEvaluationPanel({ evaluation }: { evaluation: StoredEvaluation }) {
  const policyItems = [
    ['Runway minimum', `${evaluation.policySnapshot.runwayMonthsMin} months`],
    ['ETH review threshold', `${evaluation.policySnapshot.ethReviewThreshold} ETH`],
    ['Stable review threshold', `${evaluation.policySnapshot.stableReviewThreshold.toLocaleString()} units`],
    ['Concentration max', `${evaluation.policySnapshot.assetConcentrationMaxPercent}%`],
  ] as const

  return (
    <section className="grid gap-8 lg:grid-cols-3">
      <div className="dashboard-card relative overflow-hidden p-8 lg:col-span-2">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-aegis-primary/5 blur-3xl" />
        <div className="relative z-10">
          <h3 className="flex items-center gap-2 font-headline text-xl font-bold text-aegis-text">
            <Icon name="verified_user" className="text-aegis-primary" />
            Latest durable receipt
          </h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 text-sm">
              <span className="text-aegis-text-muted">Verification method</span>
              <span className="font-mono text-aegis-primary">Hosted artifact + durable server store</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 text-sm">
              <span className="text-aegis-text-muted">Reasoning provider</span>
              <span className="font-mono text-aegis-text">{getReasoningProviderLabel(evaluation.reasoningProvider)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-3 text-sm">
              <span className="text-aegis-text-muted">Submitted by</span>
              <span className="font-mono text-aegis-text">{evaluation.submittedByAddress ? shortenAddress(evaluation.submittedByAddress) : 'Anonymous demo flow'}</span>
            </div>
            <div className="grid gap-4 pt-2 md:grid-cols-2">
              <div className="rounded-xl border border-white/8 bg-black/20 p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Public summary</div>
                <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/20 p-5">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Badge tone={getDecisionTone(evaluation.decision)}>{evaluation.decision}</Badge>
                  <Badge tone={getReasoningProviderTone(evaluation.reasoningProvider)}>{getReasoningProviderLabel(evaluation.reasoningProvider)}</Badge>
                </div>
                <div className="space-y-3">
                  {evaluation.triggeredChecks.slice(0, 2).map((check) => (
                    <div key={check.name} className="flex items-start justify-between gap-3 rounded-lg border border-white/6 bg-black/15 px-3 py-3">
                      <div>
                        <div className="text-sm font-semibold text-aegis-text">{check.name}</div>
                        <div className="mt-1 text-xs leading-5 text-aegis-text-muted">{check.detail}</div>
                      </div>
                      <Badge tone={getCheckTone(check.result)}>{getCheckLabel(check.result)}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <Link to="/decision-result" search={{ evaluation: evaluation.id }} className="inline-flex items-center gap-2 text-sm font-bold text-aegis-primary transition-all hover:gap-3">
              View full verification trail
              <Icon name="arrow_forward" className="text-sm" />
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-card-muted flex flex-col gap-6 border-l-4 border-aegis-primary p-8">
        <div>
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-aegis-primary/10 text-aegis-primary">
            <Icon name="gavel" className="text-2xl" />
          </div>
          <h4 className="font-headline text-lg font-bold text-aegis-text">Policy snapshot used</h4>
          <p className="mt-3 text-sm leading-7 text-aegis-text-muted">
            This evaluation resolves against <span className="font-semibold text-aegis-text">{evaluation.policySet.name}</span> and keeps the policy snapshot alongside the result so history stays reproducible.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-white/8 bg-black/20 p-5">
          {policyItems.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between gap-3 text-sm">
              <span className="text-aegis-text-muted">{label}</span>
              <span className="font-mono text-aegis-text">{value}</span>
            </div>
          ))}
          <div className="border-t border-white/6 pt-3 text-sm">
            <div className="mb-2 text-aegis-text-muted">Blocked categories</div>
            <div className="text-aegis-text">
              {evaluation.policySnapshot.blockedCounterpartyCategories.length
                ? evaluation.policySnapshot.blockedCounterpartyCategories.join(', ')
                : 'None configured'}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {evaluation.receipt.urls?.receiptJson ? (
            <a href={evaluation.receipt.urls.receiptJson} target="_blank" rel="noreferrer" className="inline-flex w-full">
              <Button variant="secondary" className="w-full justify-center">Open receipt JSON</Button>
            </a>
          ) : null}
          {evaluation.receipt.urls?.agentLog ? (
            <a href={evaluation.receipt.urls.agentLog} target="_blank" rel="noreferrer" className="inline-flex w-full">
              <Button variant="secondary" className="w-full justify-center">Open agent log</Button>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}
