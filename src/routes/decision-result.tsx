import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Badge } from '~/components/ui/badge'
import { Panel } from '~/components/ui/panel'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { formatEvaluationTimestamp, getCheckLabel, getCheckTone, getDecisionTone, getReasoningProviderLabel, getReasoningProviderTone, getStoredEvaluation, type StoredEvaluation } from '~/lib/api'

export const Route = createFileRoute('/decision-result')({
  validateSearch: z.object({
    evaluation: z.string().optional(),
  }),
  component: DecisionResultPage,
})

function DecisionResultPage() {
  const search = Route.useSearch()
  const [evaluation, setEvaluation] = useState<StoredEvaluation | null>(null)

  useEffect(() => {
    setEvaluation(getStoredEvaluation(search.evaluation))
  }, [search.evaluation])

  return (
    <ConsoleLayout
      eyebrow="Decision receipt"
      title="Decision result"
      description="A bounded recommendation with live guardrail results, a visible privacy split, and receipt artifacts that can be inspected without exposing private policy text."
      actions={
        <>
          <Link to="/evaluation-history" search={evaluation ? { selected: evaluation.id } : undefined} className="inline-flex">
            <Button variant="secondary">Open history</Button>
          </Link>
          <Link to="/evaluation-dashboard" className="inline-flex">
            <Button leftIcon={<Icon name="refresh" className="text-lg" />}>Run another evaluation</Button>
          </Link>
        </>
      }
    >
      {evaluation ? <DecisionResultContent evaluation={evaluation} /> : <EmptyDecisionState requestedEvaluation={search.evaluation} />}
    </ConsoleLayout>
  )
}

function DecisionResultContent({ evaluation }: { evaluation: StoredEvaluation }) {
  const decisionTone = getDecisionTone(evaluation.decision)

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <div className="space-y-6">
        <Panel tone="glass">
          <p className="eyebrow text-aegis-text-muted">Recommended action</p>
          <div className="mt-4 flex items-start gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-black/15 text-aegis-primary">
              <Icon name={evaluation.decision === 'BLOCK' ? 'block' : evaluation.decision === 'WARN' ? 'policy_alert' : 'verified'} className="text-3xl" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-5xl font-extrabold tracking-tight text-aegis-text font-headline">{evaluation.decision}</h2>
                <Badge tone={decisionTone}>{evaluation.confidence} confidence</Badge>
                <Badge tone={getReasoningProviderTone(evaluation.reasoningProvider)}>{getReasoningProviderLabel(evaluation.reasoningProvider)}</Badge>
              </div>
              <p className="mt-2 text-sm text-aegis-text-muted">Evaluated {formatEvaluationTimestamp(evaluation.createdAt)}</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
        </Panel>

        <Panel>
          <SectionHeading
            title="Triggered checks"
            description="These deterministic guardrail checks set the policy outcome before any narrative wording is generated."
            icon="checklist"
          />
          <div className="space-y-3">
            {evaluation.triggeredChecks.map((check) => (
              <div key={check.name} className="rounded-3xl bg-aegis-highest/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-aegis-text">{check.name}</h3>
                  <Badge tone={getCheckTone(check.result)}>{getCheckLabel(check.result)}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="space-y-6">
        <Panel className="border border-aegis-warning/20 bg-aegis-warning/6">
          <SectionHeading
            title="Privacy boundary"
            description="The confidential operator lane and the public-safe lane are intentionally separated in the MVP."
            icon="visibility_lock"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-aegis-warning/25 bg-black/15 p-5">
              <div className="flex items-center gap-3">
                <Badge tone="warning">Private only</Badge>
                <span className="text-sm font-semibold text-aegis-text">
                  {evaluation.reasoningProvider === 'venice' ? 'Venice rationale' : 'Fallback rationale'}
                </span>
              </div>
              <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.privateRationale}</p>
            </div>
            <div className="rounded-3xl border border-aegis-secondary/25 bg-black/15 p-5">
              <div className="flex items-center gap-3">
                <Badge tone="info">Public-safe</Badge>
                <span className="text-sm font-semibold text-aegis-text">Shareable summary</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
            </div>
          </div>
        </Panel>

        <Panel tone="glass">
          <SectionHeading
            title="Receipt metadata"
            description="Receipt links are public-safe artifacts generated for the completed evaluation."
            icon="receipt_long"
          />
          <div className="detail-list">
            <div className="detail-row"><span>Receipt class</span><span>erc8004.guardrail.evaluation.v1</span></div>
            <div className="detail-row"><span>Decision</span><span>{evaluation.decision}</span></div>
            <div className="detail-row"><span>Confidence</span><span>{evaluation.confidence}</span></div>
            <div className="detail-row"><span>Reasoning provider</span><span>{getReasoningProviderLabel(evaluation.reasoningProvider)}</span></div>
            <div className="detail-row"><span>Receipt ID</span><span>{evaluation.receipt.receiptId ?? 'session-only evaluation'}</span></div>
            <div className="detail-row"><span>Evaluation hash</span><span>{evaluation.receipt.hash ?? 'Unavailable'}</span></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            {evaluation.receipt.urls?.receiptJson ? (
              <a href={evaluation.receipt.urls.receiptJson} target="_blank" rel="noreferrer" className="inline-flex">
                <Button variant="secondary">Open receipt JSON</Button>
              </a>
            ) : null}
            {evaluation.receipt.urls?.agentJson ? (
              <a href={evaluation.receipt.urls.agentJson} target="_blank" rel="noreferrer" className="inline-flex">
                <Button variant="secondary">Open agent JSON</Button>
              </a>
            ) : null}
            {evaluation.receipt.urls?.agentLog ? (
              <a href={evaluation.receipt.urls.agentLog} target="_blank" rel="noreferrer" className="inline-flex">
                <Button variant="secondary">Open agent log</Button>
              </a>
            ) : null}
          </div>
        </Panel>
      </div>
    </div>
  )
}

function EmptyDecisionState({ requestedEvaluation }: { requestedEvaluation?: string }) {
  return (
    <Panel tone="glass" className="max-w-3xl">
      <SectionHeading
        title={requestedEvaluation ? 'Decision not found' : 'No completed evaluation yet'}
        description={requestedEvaluation
          ? 'That receipt is not available in this browser session. Run a fresh evaluation or open one from history.'
          : 'Run the MVP loop from the evaluation dashboard to populate this screen with live decision data.'}
        icon="fact_check"
      />
      <div className="flex flex-wrap gap-3">
        <Link to="/evaluation-dashboard" className="inline-flex">
          <Button>Open evaluation dashboard</Button>
        </Link>
        <Link to="/evaluation-history" className="inline-flex">
          <Button variant="secondary">Open history</Button>
        </Link>
      </div>
    </Panel>
  )
}
