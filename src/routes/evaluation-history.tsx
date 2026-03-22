import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { formatEvaluationTimestamp, getCheckLabel, getCheckTone, getDecisionTone, getReasoningProviderLabel, getReasoningProviderTone, loadEvaluationHistory, type StoredEvaluation } from '~/lib/api'

export const Route = createFileRoute('/evaluation-history')({
  validateSearch: z.object({
    selected: z.string().optional(),
  }),
  component: EvaluationHistoryPage,
})

function EvaluationHistoryPage() {
  const search = Route.useSearch()
  const [history, setHistory] = useState<StoredEvaluation[]>([])

  useEffect(() => {
    setHistory(loadEvaluationHistory())
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
        { label: 'Mean confidence', value: '0%', helper: 'No session data', tone: 'neutral' as const, icon: 'verified' },
        { label: 'Vault status', value: 'Secure', helper: 'Policies synchronized', tone: 'neutral' as const, icon: 'lock' },
      ]
    }

    const blocked = history.filter((entry) => entry.decision === 'BLOCK').length
    const average = Math.round(
      history.reduce((sum, entry) => sum + (entry.confidence === 'high' ? 98 : entry.confidence === 'medium' ? 76 : 42), 0) /
        history.length,
    )

    return [
      { label: 'Total evaluations', value: String(history.length).padStart(2, '0'), helper: 'Session audit log', tone: 'primary' as const, icon: 'trending_up' },
      { label: 'Blocks prevented', value: String(blocked), helper: 'Risk mitigated', tone: 'warning' as const, icon: 'gpp_bad' },
      { label: 'Mean confidence', value: `${average}%`, helper: 'High-fidelity audit', tone: 'neutral' as const, icon: 'verified' },
      { label: 'Vault status', value: 'Secure', helper: 'Policies synchronized', tone: 'neutral' as const, icon: 'lock' },
    ]
  }, [history])

  return (
    <ConsoleLayout
      eyebrow="Audit log of completed evaluations"
      title="Evaluation History"
      description="Review stored guardrail assessments, inspect one result in detail, and open the hosted artifacts tied to each completed run."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
      actions={
        <>
          <Button variant="secondary" type="button">Filter logs</Button>
          <Button variant="secondary" type="button">Export CSV</Button>
          <Link to="/evaluation-dashboard" className="inline-flex">
            <Button>Run new evaluation</Button>
          </Link>
        </>
      }
    >
      {history.length ? (
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
                      <tr key={entry.id} className={`dashboard-table-row ${isSelected ? 'bg-aegis-primary/6' : ''}`}>
                        <td className="px-6 py-5">
                          <div className="text-sm font-medium text-aegis-text">{formatEvaluationTimestamp(entry.createdAt)}</div>
                          <div className="mt-1 text-xs text-aegis-text-muted/60">Browser session receipt</div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <Icon name="swap_horiz" className="text-aegis-secondary" />
                            <div>
                              <div className="text-sm font-semibold text-aegis-text">{entry.publicSummary.split('. ')[0] || 'Treasury evaluation'}</div>
                              <div className="text-[11px] font-mono text-aegis-secondary/80">{entry.receipt.hash ?? 'session-only artifact'}</div>
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
                          <div className="flex justify-end gap-2">
                            <Link to="/evaluation-history" search={{ selected: entry.id }} className="inline-flex">
                              <Button variant="secondary">Inspect</Button>
                            </Link>
                            <Link to="/decision-result" search={{ evaluation: entry.id }} className="inline-flex">
                              <Button variant="secondary">Open</Button>
                            </Link>
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
          <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">No evaluations in session history</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-aegis-text-muted">Complete one treasury evaluation from the dashboard and it will appear here immediately.</p>
          <Link to="/evaluation-dashboard" className="mt-8 inline-flex">
            <Button>Open evaluation dashboard</Button>
          </Link>
        </section>
      )}
    </ConsoleLayout>
  )
}

function MissingSelectionPanel() {
  return (
    <section className="dashboard-card p-8">
      <h3 className="font-headline text-3xl font-extrabold tracking-tight text-aegis-text">Selected evaluation not found</h3>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-aegis-text-muted">That receipt is not available in this browser session. Run a new evaluation or choose another stored result.</p>
      <Link to="/evaluation-dashboard" className="mt-8 inline-flex">
        <Button>Run new evaluation</Button>
      </Link>
    </section>
  )
}

function SelectedEvaluationPanel({ evaluation }: { evaluation: StoredEvaluation }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="dashboard-card p-6 lg:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Receipt preview</div>
            <h3 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-aegis-text">{evaluation.decision} decision package</h3>
            <p className="mt-3 text-sm leading-7 text-aegis-text-muted">Inspect the stored result, provider provenance, and the public/private split from the selected evaluation.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone={getDecisionTone(evaluation.decision)}>{evaluation.decision}</Badge>
            <Badge tone={getReasoningProviderTone(evaluation.reasoningProvider)}>{getReasoningProviderLabel(evaluation.reasoningProvider)}</Badge>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-black/20 p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Private rationale</div>
            <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.privateRationale}</p>
          </div>
          <div className="rounded-xl border border-white/8 bg-black/20 p-5">
            <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Public summary</div>
            <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {evaluation.triggeredChecks.map((check) => (
            <div key={check.name} className="rounded-xl border border-white/8 bg-aegis-panel p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-aegis-text">{check.name}</p>
                <Badge tone={getCheckTone(check.result)}>{getCheckLabel(check.result)}</Badge>
              </div>
              <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="dashboard-card p-6">
          <div className="detail-list">
            <div className="detail-row"><span>Decision</span><span>{evaluation.decision}</span></div>
            <div className="detail-row"><span>Confidence</span><span>{evaluation.confidence}</span></div>
            <div className="detail-row"><span>Reasoning provider</span><span>{getReasoningProviderLabel(evaluation.reasoningProvider)}</span></div>
            <div className="detail-row"><span>Receipt ID</span><span>{evaluation.receipt.receiptId ?? evaluation.id}</span></div>
            <div className="detail-row"><span>Evaluation hash</span><span>{evaluation.receipt.hash ?? 'Unavailable'}</span></div>
          </div>
        </div>

        <div className="dashboard-card p-6">
          <div className="space-y-3">
            <Link to="/decision-result" search={{ evaluation: evaluation.id }} className="inline-flex w-full">
              <Button variant="secondary" className="w-full justify-center">Open decision view</Button>
            </Link>
            {evaluation.receipt.urls?.receiptJson ? (
              <a href={evaluation.receipt.urls.receiptJson} target="_blank" rel="noreferrer" className="inline-flex w-full">
                <Button variant="secondary" className="w-full justify-center">Receipt JSON</Button>
              </a>
            ) : null}
            {evaluation.receipt.urls?.agentJson ? (
              <a href={evaluation.receipt.urls.agentJson} target="_blank" rel="noreferrer" className="inline-flex w-full">
                <Button variant="secondary" className="w-full justify-center">Agent JSON</Button>
              </a>
            ) : null}
            {evaluation.receipt.urls?.agentLog ? (
              <a href={evaluation.receipt.urls.agentLog} target="_blank" rel="noreferrer" className="inline-flex w-full">
                <Button variant="secondary" className="w-full justify-center">Agent log</Button>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
