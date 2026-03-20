import { Link, createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { MetricCard } from '~/components/ui/metric-card'
import { Panel } from '~/components/ui/panel'
import { FieldLabel, SelectInput, TextArea, TextInput } from '~/components/ui/field'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { guardrailChecks, proposedAction, treasuryMetrics } from '~/content/aegis'
import { Icon } from '~/components/ui/icon'

export const Route = createFileRoute('/evaluation-dashboard')({
  component: EvaluationDashboardPage,
})

function EvaluationDashboardPage() {
  return (
    <ConsoleLayout
      eyebrow="Private cognition • service operations"
      title="Treasury intelligence dashboard"
      description="Continuous surveillance and policy enforcement for sovereign assets. Submit a treasury request, inspect live guardrail telemetry, and review what the agent will expose publicly versus privately."
      actions={
        <>
          <Link to="/request-service" className="inline-flex">
            <Button leftIcon={<Icon name="bolt" className="text-lg" />}>Request service</Button>
          </Link>
          <Link to="/decision-result" className="inline-flex">
            <Button variant="secondary">Open decision result</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <div className="metric-grid">
            {treasuryMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <Panel tone="glass">
            <SectionHeading
              title="Propose treasury action"
              description="One bounded action at a time. This is the highest-leverage flow for the hackathon demo."
              icon="bolt"
            />
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Amount</FieldLabel>
                <TextInput defaultValue={proposedAction.amount} className="mt-2 text-2xl font-headline font-bold" />
              </div>
              <div>
                <FieldLabel>Asset</FieldLabel>
                <SelectInput className="mt-2">
                  <option>Wrapped Ethereum (WETH)</option>
                  <option>USD Coin (USDC)</option>
                  <option>Rocket Pool ETH (rETH)</option>
                </SelectInput>
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Destination category</FieldLabel>
                <TextInput defaultValue={proposedAction.destination} className="mt-2" />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Strategic reason</FieldLabel>
                <TextArea defaultValue={proposedAction.reason} className="mt-2" />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/decision-result" className="inline-flex">
                <Button>Submit to guardians</Button>
              </Link>
              <Button variant="secondary">Save as draft</Button>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <SectionHeading
              title="Guardrail telemetry"
              description="Private checks are evaluated before the public-safe explanation is generated."
              icon="shield"
            />
            <div className="space-y-3">
              {guardrailChecks.map((check) => (
                <article key={check.name} className="rounded-3xl bg-aegis-highest/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-aegis-text">{check.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
                    </div>
                    <Badge tone={check.result === 'pass' ? 'primary' : 'warning'}>
                      {check.result === 'pass' ? 'pass' : 'review'}
                    </Badge>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHeading
              title="Public-safe preview"
              description="What external observers can learn without seeing your private treasury policy."
              icon="visibility"
            />
            <div className="rounded-3xl bg-black/15 p-5 text-sm leading-7 text-aegis-text-muted">
              This request remains within reserve concentration policy but crosses the strategic review threshold. Manual signer confirmation is recommended before execution.
            </div>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  )
}
