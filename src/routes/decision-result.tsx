import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
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
      eyebrow="Bounded recommendation with receipts"
      title="Decision Result"
      description="A live guardrail outcome with a visible privacy split, provider provenance, and inspectable hosted artifacts that stay public-safe."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
      actions={
        <>
          <Link to="/evaluation-history" search={evaluation ? { selected: evaluation.id } : undefined} className="inline-flex">
            <Button variant="secondary">Open history</Button>
          </Link>
          <Link to="/evaluation-dashboard" className="inline-flex">
            <Button>Run another evaluation</Button>
          </Link>
        </>
      }
    >
      {evaluation ? <DecisionResultContent evaluation={evaluation} /> : <EmptyDecisionState requestedEvaluation={search.evaluation} />}
    </ConsoleLayout>
  )
}

function confidencePercent(confidence: StoredEvaluation['confidence']) {
  if (confidence === 'high') return 98
  if (confidence === 'medium') return 76
  return 42
}

function DecisionResultContent({ evaluation }: { evaluation: StoredEvaluation }) {
  const decisionTone = getDecisionTone(evaluation.decision)
  const iconName = evaluation.decision === 'BLOCK' ? 'block' : evaluation.decision === 'WARN' ? 'policy_alert' : 'verified'
  const confidence = confidencePercent(evaluation.confidence)

  const guardrailSummary = useMemo(() => {
    return evaluation.triggeredChecks.map((check) => ({
      ...check,
      borderClass: check.result === 'pass' ? 'border-aegis-primary/50' : check.result === 'warn' ? 'border-aegis-warning/50' : 'border-aegis-danger/50',
    }))
  }, [evaluation.triggeredChecks])

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-aegis-secondary/10 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-aegis-secondary">
              Execution ID: {evaluation.receipt.receiptId ?? evaluation.id}
            </span>
            <span className="text-xs text-aegis-text-muted">Timestamp: {formatEvaluationTimestamp(evaluation.createdAt)}</span>
          </div>
          <h2 className="font-headline text-5xl font-extrabold tracking-tight text-aegis-text">
            Decision <span className="text-aegis-primary">Result</span>
          </h2>
        </div>

        <div className="dashboard-card flex items-center gap-5 px-6 py-5">
          <div className="relative h-16 w-16">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path className="fill-none stroke-aegis-highest" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" strokeWidth="3" />
              <path
                className="fill-none stroke-aegis-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                strokeDasharray={`${confidence}, 100`}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <span className="font-headline text-xs font-bold text-aegis-text">{confidence}%</span>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-text-muted">Confidence score</div>
            <div className="mt-1 font-headline text-lg font-bold text-aegis-text">{evaluation.confidence} assurance</div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-[24px] border border-white/8 bg-aegis-shell p-8 lg:p-10">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-aegis-primary/50 to-transparent" />
        <div className="grid gap-10 lg:grid-cols-[220px_1fr_280px] lg:items-center">
          <div className="flex justify-center">
            <div className="relative grid h-40 w-40 place-items-center rounded-full border-[8px] border-aegis-primary/20">
              <div className="absolute inset-0 rounded-full bg-aegis-primary/5" />
              <div className="text-center">
                <Icon name={iconName} className="mx-auto mb-2 text-4xl text-aegis-primary" />
                <span className="font-headline text-4xl font-black tracking-[0.16em] text-aegis-primary">{evaluation.decision}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-headline text-2xl font-bold text-aegis-text">
              {evaluation.decision === 'ALLOW'
                ? 'Treasury transaction authorized'
                : evaluation.decision === 'WARN'
                  ? 'Treasury transaction requires review'
                  : 'Treasury transaction blocked'}
            </h3>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-aegis-text-muted">{evaluation.publicSummary}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {evaluation.triggeredChecks.map((check) => (
                <Badge key={check.name} tone={getCheckTone(check.result)}>{check.name}</Badge>
              ))}
            </div>
          </div>

          <div className="dashboard-card-muted p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-text-muted">Identity verification</div>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/8 bg-black/20">
                <Icon name="fingerprint" className="text-aegis-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-aegis-text">Agent 0x-Alpha</div>
                <div className="text-[10px] font-mono text-aegis-text-muted">ID: 8829-X-22</div>
              </div>
            </div>
            <div className="mt-5 grid h-24 place-items-center rounded-lg border border-dashed border-white/10 bg-black/20">
              <span className="text-xs uppercase tracking-[0.2em] text-aegis-text-muted">Signature surface</span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={decisionTone}>{evaluation.confidence} confidence</Badge>
              <Badge tone={getReasoningProviderTone(evaluation.reasoningProvider)}>{getReasoningProviderLabel(evaluation.reasoningProvider)}</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 font-headline text-lg font-bold text-aegis-text">
              <Icon name="lock" className="text-aegis-danger" />
              Sensitive reasoning - private
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-danger">Internal audit only</span>
          </div>
          <div className="space-y-4">
            {guardrailSummary.map((check) => (
              <div key={check.name} className={`rounded-xl border-l-4 bg-aegis-shell p-5 ${check.borderClass}`}>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="text-sm font-bold text-aegis-text">{check.name}</div>
                  <Badge tone={getCheckTone(check.result)}>{getCheckLabel(check.result)}</Badge>
                </div>
                <p className="text-sm leading-7 text-aegis-text-muted">{check.detail}</p>
              </div>
            ))}
            <div className="rounded-xl border border-aegis-warning/20 bg-aegis-warning/5 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Badge tone="warning">Private rationale</Badge>
                <span className="text-sm font-semibold text-aegis-text">{evaluation.reasoningProvider === 'venice' ? 'Venice rationale' : 'Fallback rationale'}</span>
              </div>
              <p className="text-sm leading-7 text-aegis-text-muted">{evaluation.privateRationale}</p>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-2 font-headline text-lg font-bold text-aegis-text">
              <Icon name="public" className="text-aegis-secondary" />
              Public summary and receipts
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-secondary">Shareable lane</span>
          </div>

          <div className="dashboard-card p-6">
            <p className="text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/8 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Receipt class</div>
                <div className="mt-2 text-sm font-semibold text-aegis-text">erc8004.guardrail.evaluation.v1</div>
              </div>
              <div className="rounded-lg border border-white/8 bg-black/20 p-4">
                <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Evaluation hash</div>
                <div className="mt-2 break-all text-sm font-semibold text-aegis-text">{evaluation.receipt.hash ?? 'Unavailable'}</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-headline text-lg font-bold text-aegis-text">Artifact strip</h4>
              <Badge tone="neutral">Public-safe</Badge>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <ArtifactButton href={evaluation.receipt.urls?.receiptJson} label="Receipt JSON" icon="receipt_long" />
              <ArtifactButton href={evaluation.receipt.urls?.agentJson} label="Agent JSON" icon="description" />
              <ArtifactButton href={evaluation.receipt.urls?.agentLog} label="Agent log" icon="history" />
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function ArtifactButton({ href, label, icon }: { href?: string | null; label: string; icon: string }) {
  if (!href) {
    return (
      <div className="rounded-lg border border-dashed border-white/10 bg-black/15 p-4 opacity-60">
        <div className="flex items-center gap-3 text-sm text-aegis-text-muted">
          <Icon name={icon} className="text-base" />
          <span>{label}</span>
        </div>
      </div>
    )
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className="rounded-lg border border-white/8 bg-black/20 p-4 hover:bg-white/[0.04]">
      <div className="flex items-center gap-3 text-sm font-semibold text-aegis-text">
        <Icon name={icon} className="text-base text-aegis-primary" />
        <span>{label}</span>
      </div>
    </a>
  )
}

function EmptyDecisionState({ requestedEvaluation }: { requestedEvaluation?: string }) {
  return (
    <section className="dashboard-card max-w-4xl p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 text-aegis-primary">
        <Icon name="fact_check" className="text-3xl" />
        <span className="eyebrow">Decision receipt</span>
      </div>
      <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">
        {requestedEvaluation ? 'Decision not found' : 'No completed evaluation yet'}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-aegis-text-muted">
        {requestedEvaluation
          ? 'That receipt is not available in this browser session. Run a fresh evaluation or open one from history.'
          : 'Run the MVP loop from the evaluation dashboard to populate this screen with live decision data.'}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/evaluation-dashboard" className="inline-flex">
          <Button>Open evaluation dashboard</Button>
        </Link>
        <Link to="/evaluation-history" className="inline-flex">
          <Button variant="secondary">Open history</Button>
        </Link>
      </div>
    </section>
  )
}
