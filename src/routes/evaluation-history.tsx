import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Badge } from '~/components/ui/badge'
import { Panel } from '~/components/ui/panel'
import { Button } from '~/components/ui/button'
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

  return (
    <ConsoleLayout
      eyebrow="Receipts • review log"
      title="Evaluation history"
      description="Review completed treasury evaluations, inspect one result in detail, and open the receipt artifacts associated with each run."
      actions={
        <Link to="/evaluation-dashboard" className="inline-flex">
          <Button>Run new evaluation</Button>
        </Link>
      }
    >
      {history.length ? (
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <Panel>
            <SectionHeading
              title="Recent evaluations"
              description="Completed evaluations are stored for this browser session without persisting raw policy drafts to localStorage."
              icon="history"
            />
            <div className="space-y-3">
              {history.map((entry) => {
                const isSelected = entry.id === selected?.id

                return (
                  <Link
                    key={entry.id}
                    to="/evaluation-history"
                    search={{ selected: entry.id }}
                    className={`block rounded-3xl p-4 transition-colors ${isSelected ? 'bg-aegis-primary/10' : 'bg-aegis-highest/60 hover:bg-aegis-highest/80'}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-aegis-text">{entry.receipt.receiptId ?? entry.id}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">
                          {formatEvaluationTimestamp(entry.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-wrap justify-end gap-2">
                        <Badge tone={getDecisionTone(entry.decision)}>{entry.decision}</Badge>
                        <Badge tone={getReasoningProviderTone(entry.reasoningProvider)}>{getReasoningProviderLabel(entry.reasoningProvider)}</Badge>
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-aegis-text-muted">{entry.publicSummary}</p>
                  </Link>
                )
              })}
            </div>
          </Panel>

          {selected ? <SelectedEvaluationPanel evaluation={selected} /> : <MissingSelectionPanel />}
        </div>
      ) : (
        <Panel tone="glass" className="max-w-3xl">
          <SectionHeading
            title="No evaluations in session history"
            description="Complete one treasury evaluation from the dashboard and it will appear here immediately."
            icon="fact_check"
          />
          <Link to="/evaluation-dashboard" className="inline-flex">
            <Button>Open evaluation dashboard</Button>
          </Link>
        </Panel>
      )}
    </ConsoleLayout>
  )
}

function MissingSelectionPanel() {
  return (
    <Panel tone="glass">
      <SectionHeading
        title="Selected evaluation not found"
        description="That receipt is not available in this browser session. Run a new evaluation or choose another stored result."
        icon="warning"
      />
      <Link to="/evaluation-dashboard" className="inline-flex">
        <Button>Run new evaluation</Button>
      </Link>
    </Panel>
  )
}

function SelectedEvaluationPanel({ evaluation }: { evaluation: StoredEvaluation }) {
  return (
    <Panel tone="glass">
      <SectionHeading
        title="Selected result"
        description="Inspect the stored decision, both explanation lanes, and the linked receipt artifacts."
        icon="receipt_long"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-black/15 p-4">
          <p className="eyebrow text-aegis-text-muted">Decision</p>
          <div className="mt-3 flex items-center gap-3">
            <p className="text-4xl font-extrabold text-aegis-text font-headline">{evaluation.decision}</p>
            <Badge tone={getDecisionTone(evaluation.decision)}>{evaluation.confidence}</Badge>
            <Badge tone={getReasoningProviderTone(evaluation.reasoningProvider)}>{getReasoningProviderLabel(evaluation.reasoningProvider)}</Badge>
          </div>
        </div>
        <div className="rounded-3xl bg-black/15 p-4">
          <p className="eyebrow text-aegis-text-muted">Timestamp</p>
          <p className="mt-3 text-xl font-bold text-aegis-text font-headline">{formatEvaluationTimestamp(evaluation.createdAt)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-aegis-warning/25 bg-black/15 p-4">
          <div className="flex items-center gap-3">
            <Badge tone="warning">Private only</Badge>
            <p className="text-sm font-semibold text-aegis-text">Private rationale</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.privateRationale}</p>
        </div>
        <div className="rounded-3xl border border-aegis-secondary/25 bg-black/15 p-4">
          <div className="flex items-center gap-3">
            <Badge tone="info">Public-safe</Badge>
            <p className="text-sm font-semibold text-aegis-text">Public summary</p>
          </div>
          <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {evaluation.triggeredChecks.map((check) => (
          <div key={check.name} className="rounded-3xl bg-aegis-highest/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-aegis-text">{check.name}</p>
              <Badge tone={getCheckTone(check.result)}>{getCheckLabel(check.result)}</Badge>
            </div>
            <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link to="/decision-result" search={{ evaluation: evaluation.id }} className="inline-flex">
          <Button variant="secondary">Open decision view</Button>
        </Link>
        {evaluation.receipt.urls?.receiptJson ? (
          <a href={evaluation.receipt.urls.receiptJson} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="secondary">Receipt JSON</Button>
          </a>
        ) : null}
        {evaluation.receipt.urls?.agentJson ? (
          <a href={evaluation.receipt.urls.agentJson} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="secondary">Agent JSON</Button>
          </a>
        ) : null}
        {evaluation.receipt.urls?.agentLog ? (
          <a href={evaluation.receipt.urls.agentLog} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="secondary">Agent log</Button>
          </a>
        ) : null}
      </div>
    </Panel>
  )
}
