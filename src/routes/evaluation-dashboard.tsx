import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { MetricCard } from '~/components/ui/metric-card'
import { Panel } from '~/components/ui/panel'
import { FieldLabel, TextArea } from '~/components/ui/field'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { guardrailCheckBlueprints, demoEvaluationDraft, treasuryMetrics } from '~/content/aegis'
import { Icon } from '~/components/ui/icon'
import { saveCompletedEvaluation, submitDemoEvaluation, type DemoEvaluationRequest } from '~/lib/api'

export const Route = createFileRoute('/evaluation-dashboard')({
  component: EvaluationDashboardPage,
})

function EvaluationDashboardPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<DemoEvaluationRequest>({ ...demoEvaluationDraft })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      const response = await submitDemoEvaluation(form)
      const record = saveCompletedEvaluation(response)

      await navigate({
        to: '/decision-result',
        search: { evaluation: record.id },
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to evaluate this treasury action right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ConsoleLayout
      eyebrow="Private cognition • service operations"
      title="Treasury evaluation dashboard"
      description="Run one treasury action through the Aegis guardrail loop. Deterministic policy checks set the outcome first, then Venice prepares the private rationale and public-safe explanation."
      actions={
        <>
          <Link to="/evaluation-history" className="inline-flex">
            <Button variant="secondary">Open history</Button>
          </Link>
          <Link to="/request-service" className="inline-flex">
            <Button leftIcon={<Icon name="bolt" className="text-lg" />}>Request service</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="metric-grid">
            {treasuryMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <Panel tone="glass">
            <SectionHeading
              title="Submit treasury evaluation"
              description="Drafts stay in component state only. Aegis does not write treasury policy, treasury state, or proposed action text to localStorage by default."
              icon="fact_check"
            />
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <FieldLabel>Treasury policy</FieldLabel>
                <TextArea
                  value={form.treasuryPolicy}
                  onChange={(event) => setForm((current) => ({ ...current, treasuryPolicy: event.target.value }))}
                  className="mt-2 min-h-40"
                  placeholder="Paste the confidential treasury policy or guardrail excerpts here."
                />
              </div>

              <div>
                <FieldLabel>Treasury state</FieldLabel>
                <TextArea
                  value={form.treasuryState}
                  onChange={(event) => setForm((current) => ({ ...current, treasuryState: event.target.value }))}
                  className="mt-2 min-h-32"
                  placeholder="Describe current reserves, runway, concentration, and operator context."
                />
              </div>

              <div>
                <FieldLabel>Proposed action</FieldLabel>
                <TextArea
                  value={form.proposedAction}
                  onChange={(event) => setForm((current) => ({ ...current, proposedAction: event.target.value }))}
                  className="mt-2 min-h-32"
                  placeholder="Describe the treasury action you want Aegis to evaluate."
                />
              </div>

              <div className="rounded-3xl bg-black/15 p-5 text-sm leading-6 text-aegis-text-muted">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone="primary">Deterministic first</Badge>
                  <Badge tone="info">Venice explanation</Badge>
                  <Badge tone="warning">Receipt attached</Badge>
                </div>
                <p className="mt-4">
                  Submitting this form calls <code>/api/evaluate/demo</code>, stores only the completed evaluation response for this browser session, and routes you to the live decision screen.
                </p>
              </div>

              {errorMessage ? (
                <div className="rounded-3xl border border-aegis-warning/30 bg-aegis-warning/10 px-5 py-4 text-sm text-aegis-text">
                  {errorMessage}
                </div>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                  leftIcon={<Icon name={isSubmitting ? 'hourglass_top' : 'play_circle'} className="text-lg" />}
                >
                  {isSubmitting ? 'Evaluating guardrails...' : 'Submit evaluation'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setForm({ ...demoEvaluationDraft })}
                  disabled={isSubmitting}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Reset demo inputs
                </Button>
              </div>
            </form>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <SectionHeading
              title="Guardrail telemetry"
              description="These deterministic checks define the policy outcome before the narrative layer writes any explanation."
              icon="shield"
            />
            <div className="space-y-3">
              {guardrailCheckBlueprints.map((check) => (
                <article key={check.name} className="rounded-3xl bg-aegis-highest/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-aegis-text">{check.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
                    </div>
                    <Badge tone="neutral">deterministic</Badge>
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHeading
              title="Public-safe boundary"
              description="Private rationale stays in the confidential operator lane. The shareable summary is generated separately."
              icon="visibility_lock"
            />
            <div className="space-y-4 rounded-3xl bg-black/15 p-5 text-sm leading-7 text-aegis-text-muted">
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="warning">Private lane</Badge>
                <span>Full rationale for treasury operators and signers.</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="info">Public-safe lane</Badge>
                <span>High-level explanation and receipt artifacts with no verbatim policy text.</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  )
}
