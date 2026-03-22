import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useMemo, useState } from 'react'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FieldLabel, TextArea } from '~/components/ui/field'
import { Icon } from '~/components/ui/icon'
import { MetricCard } from '~/components/ui/metric-card'
import { demoEvaluationDraft, guardrailCheckBlueprints, treasuryMetrics } from '~/content/aegis'
import { saveCompletedEvaluation, submitDemoEvaluation, type DemoEvaluationRequest } from '~/lib/api'

export const Route = createFileRoute('/evaluation-dashboard')({
  component: EvaluationDashboardPage,
})

const assetRows = [
  { name: 'Ethereum', symbol: 'ETH', balance: '8,420 ETH', value: '$18,242,100', allocation: 42, accent: '#627eea' },
  { name: 'USD Coin', symbol: 'USDC', balance: '11,402,182 USDC', value: '$11,402,182', allocation: 27, accent: '#2775ca' },
  { name: 'Lido stETH', symbol: 'st', balance: '4,138 stETH', value: '$8,994,221', allocation: 21, accent: '#00a3ff' },
  { name: 'Base Ecosystem', symbol: 'B', balance: 'Strategic Program', value: '$4,252,537', allocation: 10, accent: '#2dd4bf' },
] as const

function EvaluationDashboardPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<DemoEvaluationRequest>({ ...demoEvaluationDraft })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const proposedActionPreview = useMemo(() => {
    const amountMatch = form.proposedAction.match(/(\d+[\d,.]*)\s*ETH/i)
    const destinationMatch = form.proposedAction.match(/to\s+([^.,\n]+)/i)

    return {
      amount: amountMatch ? `${amountMatch[1]} ETH` : '450 ETH',
      asset: form.proposedAction.includes('stable') ? 'USD Coin (USDC)' : 'Wrapped Ethereum (WETH)',
      destination: destinationMatch?.[1]?.trim() || 'Base ecosystem market-making program',
    }
  }, [form.proposedAction])

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
      eyebrow="Private cognition and policy enforcement"
      title="Treasury Intelligence"
      description="Continuous surveillance and policy enforcement for sovereign assets. Aegis preserves the live evaluation flow while mirroring the Stitch dashboard composition more closely."
      contentClassName="max-w-[1400px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
      actions={
        <>
          <Link to="/evaluation-history" className="inline-flex">
            <Button variant="secondary">Open history</Button>
          </Link>
          <Link to="/request-service" className="inline-flex">
            <Button>Request service</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-6 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {treasuryMetrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <section className="dashboard-card overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/6 px-6 py-5">
              <div>
                <h2 className="font-headline text-lg font-bold text-aegis-text">Current Asset State</h2>
                <p className="mt-1 text-sm text-aegis-text-muted">Closest presentational equivalent of the Stitch allocation table using the existing MVP treasury story.</p>
              </div>
              <button className="text-sm font-medium text-aegis-secondary hover:text-aegis-text" type="button">
                View analytics
              </button>
            </div>
            <div className="overflow-x-auto p-4">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="text-[11px] uppercase tracking-[0.2em] text-aegis-text-muted/55">
                    <th className="px-4 py-3">Asset Name</th>
                    <th className="px-4 py-3">Balance</th>
                    <th className="px-4 py-3">Value (USD)</th>
                    <th className="px-4 py-3 text-right">Allocation</th>
                  </tr>
                </thead>
                <tbody>
                  {assetRows.map((row) => (
                    <tr key={row.name} className="dashboard-table-row">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-9 w-9 place-items-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: row.accent }}>
                            {row.symbol}
                          </div>
                          <span className="font-medium text-aegis-text">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-aegis-text-muted">{row.balance}</td>
                      <td className="px-4 py-4 text-sm text-aegis-text">{row.value}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <span className="text-xs text-aegis-text-muted">{row.allocation}%</span>
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-aegis-highest">
                            <div className="h-full bg-aegis-primary" style={{ width: `${row.allocation}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="dashboard-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-headline text-lg font-bold text-aegis-text">Guardrail telemetry</h2>
                <p className="mt-1 text-sm text-aegis-text-muted">Deterministic checks define the recommendation before the narrative layer writes any explanation.</p>
              </div>
              <Badge tone="primary">Deterministic first</Badge>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {guardrailCheckBlueprints.map((check, index) => (
                <article key={check.name} className="rounded-xl border border-white/6 bg-aegis-panel px-5 py-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-aegis-text">{check.name}</h3>
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${index === 1 ? 'bg-aegis-warning' : 'bg-aegis-primary'}`} />
                  </div>
                  <p className="text-sm leading-6 text-aegis-text-muted">{check.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 xl:row-span-2">
          <section className="surface-glass h-full rounded-xl border border-white/10 p-8 shadow-2xl shadow-black/30">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-aegis-text">Propose Action</h2>
              <Icon name="bolt" className="text-2xl text-aegis-primary" />
            </div>

            <div className="mb-8 grid gap-3 rounded-xl border border-white/6 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-aegis-text-muted">Derived amount</span>
                <span className="font-headline text-xl font-bold text-aegis-text">{proposedActionPreview.amount}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-aegis-text-muted">Asset</span>
                <span className="text-sm font-medium text-aegis-text">{proposedActionPreview.asset}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[11px] uppercase tracking-[0.2em] text-aegis-text-muted">Destination</span>
                <span className="max-w-[180px] text-right text-sm text-aegis-text-muted">{proposedActionPreview.destination}</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <FieldLabel>Treasury policy</FieldLabel>
                <TextArea
                  value={form.treasuryPolicy}
                  onChange={(event) => setForm((current) => ({ ...current, treasuryPolicy: event.target.value }))}
                  className="mt-2 min-h-36 rounded-none border-0 border-b border-white/10 bg-transparent px-0"
                  placeholder="Paste the confidential treasury policy or guardrail excerpts here."
                />
              </div>

              <div>
                <FieldLabel>Treasury state</FieldLabel>
                <TextArea
                  value={form.treasuryState}
                  onChange={(event) => setForm((current) => ({ ...current, treasuryState: event.target.value }))}
                  className="mt-2 min-h-28 rounded-none border-0 border-b border-white/10 bg-transparent px-0"
                  placeholder="Describe reserves, runway, concentration, and operator context."
                />
              </div>

              <div>
                <FieldLabel>Strategic reason and proposed action</FieldLabel>
                <TextArea
                  value={form.proposedAction}
                  onChange={(event) => setForm((current) => ({ ...current, proposedAction: event.target.value }))}
                  className="mt-2 min-h-32 rounded-none border-0 border-b border-white/10 bg-transparent px-0"
                  placeholder="Describe the treasury action you want Aegis to evaluate."
                />
              </div>

              <div className="rounded-xl border border-aegis-secondary/15 bg-aegis-secondary/5 p-4 text-sm leading-6 text-aegis-text-muted">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="warning">Private lane</Badge>
                  <Badge tone="info">Public-safe lane</Badge>
                  <Badge tone="neutral">Receipt attached</Badge>
                </div>
                <p className="mt-4">Submits to <code>/api/evaluate/demo</code>, stores only the completed result in session history, and routes to the live decision screen.</p>
              </div>

              {errorMessage ? (
                <div className="rounded-xl border border-aegis-warning/30 bg-aegis-warning/10 px-4 py-3 text-sm text-aegis-text">
                  {errorMessage}
                </div>
              ) : null}

              <div className="space-y-3 pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  leftIcon={<Icon name={isSubmitting ? 'hourglass_top' : 'play_circle'} className="text-lg" />}
                >
                  {isSubmitting ? 'Evaluating guardrails' : 'Submit to guardians'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isSubmitting}
                  className="w-full justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={() => setForm({ ...demoEvaluationDraft })}
                >
                  Reset demo inputs
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </ConsoleLayout>
  )
}
