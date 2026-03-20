import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Badge } from '~/components/ui/badge'
import { Panel } from '~/components/ui/panel'
import { Button } from '~/components/ui/button'
import { Link } from '@tanstack/react-router'
import { guardrailChecks, proposedAction } from '~/content/aegis'

export const Route = createFileRoute('/decision-result')({
  component: DecisionResultPage,
})

function DecisionResultPage() {
  return (
    <ConsoleLayout
      eyebrow="Decision receipt"
      title="Decision result"
      description="A bounded recommendation with private reasoning, a public-safe summary, and receipt-grade trust metadata for reviewer and signer workflows."
      actions={
        <>
          <Link to="/evaluation-history" className="inline-flex">
            <Button variant="secondary">Open history</Button>
          </Link>
          <Link to="/request-service" className="inline-flex">
            <Button>Escalate request</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Panel tone="glass">
            <p className="eyebrow text-aegis-text-muted">Recommended action</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-aegis-warning/12 text-aegis-warning">
                <span className="material-symbols-outlined text-3xl">policy_alert</span>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-5xl font-extrabold tracking-tight text-aegis-warning font-headline">WARN</h2>
                  <Badge tone="warning">Signer review required</Badge>
                </div>
                <p className="mt-2 text-sm text-aegis-text-muted">{proposedAction.amount} • {proposedAction.asset}</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-7 text-aegis-text-muted">
              The request remains inside reserve safety bounds, but exceeds the manual review threshold for strategic ETH allocations. Proceed only with signer acknowledgement and a recorded justification.
            </p>
          </Panel>

          <Panel>
            <SectionHeading
              title="Triggered checks"
              description="The exact control surfaces that informed the recommendation."
              icon="checklist"
            />
            <div className="space-y-3">
              {guardrailChecks.map((check) => (
                <div key={check.name} className="rounded-3xl bg-aegis-highest/60 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-aegis-text">{check.name}</h3>
                    <Badge tone={check.result === 'pass' ? 'primary' : 'warning'}>
                      {check.result === 'pass' ? 'pass' : 'review'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <SectionHeading
              title="Private rationale"
              description="Only visible in the confidential operator view."
              icon="lock"
            />
            <div className="rounded-3xl bg-black/15 p-5 text-sm leading-7 text-aegis-text-muted">
              Strategic liquidity expansion remains acceptable because the stable reserve runway stays above 18 months and ETH concentration remains within the approved upper bound. The recommendation is downgraded from ALLOW to WARN because the transfer exceeds the single-action review threshold and touches a strategic market-making destination.
            </div>
          </Panel>

          <Panel>
            <SectionHeading
              title="Public-safe summary"
              description="Safe to share with broader stakeholders or automated coordination surfaces."
              icon="visibility"
            />
            <div className="rounded-3xl bg-black/15 p-5 text-sm leading-7 text-aegis-text-muted">
              This treasury request remains within current reserve and concentration guardrails, but should be escalated for manual confirmation because it crosses a policy review threshold.
            </div>
          </Panel>

          <Panel tone="glass">
            <SectionHeading
              title="Receipt metadata"
              description="The trust layer that makes the recommendation auditable."
              icon="receipt_long"
            />
            <div className="detail-list">
              <div className="detail-row"><span>Receipt class</span><span>erc8004.guardrail.evaluation.v1</span></div>
              <div className="detail-row"><span>Decision</span><span>WARN</span></div>
              <div className="detail-row"><span>Allowed next step</span><span>Manual signer confirmation</span></div>
              <div className="detail-row"><span>Evaluation hash</span><span>0x8e7…4c1</span></div>
              <div className="detail-row"><span>Operator</span><span>Aegis / Treasury Guardrails</span></div>
            </div>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  )
}
