import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Badge } from '~/components/ui/badge'
import { Panel } from '~/components/ui/panel'
import { evaluationHistory } from '~/content/aegis'

export const Route = createFileRoute('/evaluation-history')({
  component: EvaluationHistoryPage,
})

function EvaluationHistoryPage() {
  const selected = evaluationHistory[0]

  return (
    <ConsoleLayout
      eyebrow="Receipts • review log"
      title="Evaluation history"
      description="A two-pane audit surface that helps treasurers review past decisions, understand why they were made, and verify what evidence was preserved for human oversight."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <SectionHeading
            title="Recent evaluations"
            description="Chronological list of treasury requests and their final recommendation state."
            icon="history"
          />
          <div className="space-y-3">
            {evaluationHistory.map((entry, index) => (
              <article
                key={entry.id}
                className={`rounded-3xl p-4 ${index === 0 ? 'bg-aegis-primary/10' : 'bg-aegis-highest/60'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-aegis-text">{entry.title}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">{entry.id}</p>
                  </div>
                  <Badge tone={entry.decision === 'ALLOW' ? 'primary' : entry.decision === 'WARN' ? 'warning' : 'info'}>
                    {entry.decision}
                  </Badge>
                </div>
                <p className="mt-3 text-sm text-aegis-text-muted">{entry.asset}</p>
                <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{entry.summary}</p>
                <p className="mt-3 text-xs text-aegis-text-muted/80">{entry.timestamp}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel tone="glass">
          <SectionHeading
            title="Selected receipt"
            description="Detailed reasoning and escalation metadata for the highlighted treasury evaluation."
            icon="fact_check"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl bg-black/15 p-4">
              <p className="eyebrow text-aegis-text-muted">Decision</p>
              <p className="mt-3 text-4xl font-extrabold text-aegis-warning font-headline">{selected.decision}</p>
            </div>
            <div className="rounded-3xl bg-black/15 p-4">
              <p className="eyebrow text-aegis-text-muted">Action</p>
              <p className="mt-3 text-2xl font-bold text-aegis-text font-headline">{selected.asset}</p>
            </div>
          </div>
          <div className="mt-5 detail-list">
            <div className="detail-row"><span>Escalation reason</span><span>Transfer threshold crossed</span></div>
            <div className="detail-row"><span>Private rationale</span><span>Reserve floor preserved, signer review required</span></div>
            <div className="detail-row"><span>Public-safe message</span><span>Approved for manual review with no active reserve breach</span></div>
            <div className="detail-row"><span>Receipt class</span><span>ERC-8004 guardrail evaluation</span></div>
            <div className="detail-row"><span>Operator readiness</span><span>Healthy</span></div>
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  )
}
