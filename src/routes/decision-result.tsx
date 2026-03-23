import { Link, createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { fetchStoredEvaluation, formatEvaluationTimestamp, getCheckLabel, getCheckTone, getDecisionTone, getReasoningProviderLabel, getReasoningProviderTone, shortenAddress, type StoredEvaluation } from '~/lib/api'
import { getPolicySummaryItems } from '~/lib/policies'

export const Route = createFileRoute('/decision-result')({
  validateSearch: z.object({
    evaluation: z.string().optional(),
  }),
  component: DecisionResultPage,
})

function DecisionResultPage() {
  const search = Route.useSearch()
  const [evaluation, setEvaluation] = useState<StoredEvaluation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    setIsLoading(true)
    setErrorMessage(null)

    fetchStoredEvaluation(search.evaluation)
      .then((record) => {
        if (!isCancelled) {
          setEvaluation(record)
        }
      })
      .catch((error) => {
        if (!isCancelled) {
          setEvaluation(null)
          setErrorMessage(error instanceof Error ? error.message : 'Unable to load this evaluation right now.')
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
  }, [search.evaluation])

  return (
    <ConsoleLayout
      eyebrow="Bounded recommendation with receipts"
      title="Decision Result"
      description="A live guardrail outcome with a visible privacy split, provider provenance, and public-safe hosted artifacts. The result is reloaded from the server-backed store so the same evaluation survives refreshes, new tabs, and local restarts."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="primary">Live result view</Badge>}
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
      {isLoading ? <DecisionLoadingState /> : evaluation ? <DecisionResultContent evaluation={evaluation} /> : <EmptyDecisionState requestedEvaluation={search.evaluation} errorMessage={errorMessage} />}
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
  const policySummary = getPolicySummaryItems(evaluation.policySnapshot)

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
            <span className="text-xs text-aegis-text-muted">
              Operator: {evaluation.submittedByAddress ? shortenAddress(evaluation.submittedByAddress) : 'Anonymous demo flow'}
            </span>
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
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-text-muted">Trust surface status</div>
            <div className="mt-5 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/8 bg-black/20">
                <Icon name="fingerprint" className="text-aegis-primary" />
              </div>
              <div>
                <div className="text-sm font-bold text-aegis-text">Hosted demo receipt lane</div>
                <div className="text-[10px] font-mono text-aegis-text-muted">Manifest published, signatures not yet attached</div>
              </div>
            </div>
            <div className="mt-5 rounded-lg border border-dashed border-white/10 bg-black/20 p-4 text-sm leading-6 text-aegis-text-muted">
              Receipt JSON, agent manifest, and public-safe log links are live. This decision view reloads from the local durable server store, but the trust artifacts remain unsigned demo-grade surfaces.
            </div>
            <div className="mt-4 rounded-lg border border-white/8 bg-black/20 p-4 text-sm leading-6 text-aegis-text-muted">
              Submitted by <span className="font-mono text-aegis-text">{evaluation.submittedByAddress ? shortenAddress(evaluation.submittedByAddress) : 'Anonymous demo flow'}</span> against policy set <span className="font-semibold text-aegis-text">{evaluation.policySet.name}</span>.
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge tone={decisionTone}>{evaluation.confidence} confidence</Badge>
              <Badge tone={getReasoningProviderTone(evaluation.reasoningProvider)}>{getReasoningProviderLabel(evaluation.reasoningProvider)}</Badge>
              <Badge tone="warning">Unsigned artifacts</Badge>
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
              <Icon name="share" className="text-aegis-secondary" />
              Public summary
            </h3>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-secondary">Shareable lane</span>
          </div>

          <div className="dashboard-card relative overflow-hidden p-8">
            <div className="absolute right-0 top-0 p-4 opacity-[0.04]">
              <Icon name="verified_user" className="text-[88px] text-aegis-text" />
            </div>
            <div className="relative z-10 space-y-6">
              <div className="border-b border-white/6 pb-6">
                <div className="mb-2 text-sm font-bold text-aegis-text">Objective overview</div>
                <p className="text-sm leading-7 text-aegis-text-muted">{evaluation.publicSummary}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Risk rating</div>
                  <div className="mt-2 font-headline text-xl font-bold text-aegis-primary">{evaluation.decision === 'ALLOW' ? 'Negligible' : evaluation.decision === 'WARN' ? 'Controlled' : 'Elevated'}</div>
                </div>
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Veto status</div>
                  <div className="mt-2 font-headline text-xl font-bold text-aegis-text">{evaluation.decision === 'BLOCK' ? 'Active' : 'None'}</div>
                </div>
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Policy set</div>
                  <div className="mt-2 font-headline text-xl font-bold text-aegis-text">{evaluation.policySet.name}</div>
                </div>
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Submitted by</div>
                  <div className="mt-2 font-headline text-xl font-bold text-aegis-text">{evaluation.submittedByAddress ? shortenAddress(evaluation.submittedByAddress) : 'Anonymous'}</div>
                </div>
              </div>
              {evaluation.receipt.urls?.receiptJson ? (
                <a href={evaluation.receipt.urls.receiptJson} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-aegis-secondary transition-colors hover:text-aegis-primary">
                  <Icon name="download" className="text-sm" />
                  Download public audit JSON
                </a>
              ) : null}
            </div>
          </div>

          <div className="dashboard-card flex items-center justify-between gap-4 border-dashed p-6">
            <div className="flex items-center gap-4">
              <Icon name="receipt_long" className="text-3xl text-aegis-primary" />
              <div>
                <div className="text-sm font-bold text-aegis-text">Hosted receipt record</div>
                <div className="text-[0.6875rem] text-aegis-text-muted">Hash: {evaluation.receipt.hash ?? 'Unavailable'} • persisted server record</div>
              </div>
            </div>
            <Link to="/evaluation-history" search={{ selected: evaluation.id }} className="inline-flex">
              <Button variant="secondary">Open verification trail</Button>
            </Link>
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

          <div className="dashboard-card p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h4 className="font-headline text-lg font-bold text-aegis-text">Policy snapshot used</h4>
              <Badge tone="info">Historical context</Badge>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {policySummary.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/8 bg-black/20 p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">{item.label}</div>
                  <div className="mt-2 text-sm font-semibold text-aegis-text">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-auto flex flex-col items-center justify-between gap-6 border-t border-white/6 pt-10 md:flex-row">
        <div className="flex flex-wrap gap-4">
          <Link to="/evaluation-history" search={{ selected: evaluation.id }} className="inline-flex">
            <Button leftIcon={<Icon name="verified" className="text-base" />}>Review in history</Button>
          </Link>
          <a href={evaluation.receipt.urls?.agentJson ?? evaluation.receipt.urls?.receiptJson ?? undefined} target="_blank" rel="noreferrer" className="inline-flex">
            <Button variant="secondary" leftIcon={<Icon name="share_windows" className="text-base" />}>Open public-safe artifact</Button>
          </a>
        </div>
        <div className="flex items-center gap-6 text-sm text-aegis-text-muted">
          <Badge tone="info">Durable demo artifacts</Badge>
          <div className="h-4 w-px bg-white/10" />
          <div className="font-mono text-xs">server-backed result view</div>
        </div>
      </footer>
    </div>
  )
}

function DecisionLoadingState() {
  return (
    <section className="dashboard-card max-w-4xl p-8 lg:p-10">
      <div className="mb-6 flex items-center gap-3 text-aegis-primary">
        <Icon name="progress_activity" className="text-3xl" />
        <span className="eyebrow">Loading evaluation</span>
      </div>
      <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">Fetching persisted decision</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-aegis-text-muted">Aegis is loading the stored result, receipt links, and public-safe artifacts from the durable server history.</p>
    </section>
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

function EmptyDecisionState({ requestedEvaluation, errorMessage }: { requestedEvaluation?: string; errorMessage?: string | null }) {
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
        {errorMessage
          ? errorMessage
          : requestedEvaluation
            ? 'That evaluation is not available in the durable store. Run a fresh evaluation or open another record from history.'
            : 'Run the MVP loop from the evaluation dashboard to populate this screen with a persisted decision record.'}
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
