import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { FieldLabel, TextArea, UnderlinedSelectInput, UnderlinedTextArea, UnderlinedTextInput } from '~/components/ui/field'
import { Icon } from '~/components/ui/icon'
import { MetricCard } from '~/components/ui/metric-card'
import { demoEvaluationDraft, policies, treasuryMetrics } from '~/content/aegis'
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

const assetOptions = ['Wrapped Ethereum (WETH)', 'USD Coin (USDC)', 'Lido stETH'] as const

function deriveActionComposer(action: string) {
  const amountMatch = action.match(/(\d+[\d,.]*)\s*(ETH|WETH|USDC|stETH)/i)
  const destinationMatch = action.match(/to\s+([^.,\n]+)/i)

  return {
    amount: amountMatch?.[1] ?? '450',
    asset: action.includes('stable') ? 'USD Coin (USDC)' : 'Wrapped Ethereum (WETH)',
    destination: destinationMatch?.[1]?.trim() ?? 'Base MM Program',
    reason: 'Deepen protocol liquidity while preserving runway and concentration thresholds.',
  }
}

function EvaluationDashboardPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<DemoEvaluationRequest>({ ...demoEvaluationDraft })
  const [actionComposer, setActionComposer] = useState(() => deriveActionComposer(demoEvaluationDraft.proposedAction))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateActionField<K extends keyof typeof actionComposer>(key: K, value: (typeof actionComposer)[K]) {
    setActionComposer((current) => {
      const next = { ...current, [key]: value }
      return next
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsSubmitting(true)

    const composedAction = `${actionComposer.reason.trim()} Transfer ${actionComposer.amount || '0'} ${actionComposer.asset} to ${actionComposer.destination || 'the specified destination'} while keeping stablecoin runway intact.`
    const payload: DemoEvaluationRequest = {
      ...form,
      proposedAction: composedAction,
    }

    try {
      const response = await submitDemoEvaluation(payload)
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

          <section>
            <div className="grid gap-6 md:grid-cols-3">
              {policies.slice(0, 2).map((policy, index) => (
                <article key={policy.id} className="dashboard-card p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h3 className="font-headline text-lg font-bold text-aegis-text">{index === 0 ? 'Spending Limit' : 'Whitelist Only'}</h3>
                    <span className="rounded bg-aegis-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-aegis-primary">Active</span>
                  </div>
                  <p className="min-h-16 text-xs leading-6 text-aegis-text-muted">
                    {index === 0
                      ? 'Daily withdrawal cap restricted to 2.5% of total TVL per multisig epoch.'
                      : 'Funds can only be transferred to verified counterparty addresses.'}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-[10px] font-medium text-aegis-text-muted">
                    <Icon name={index === 0 ? 'lock_clock' : 'verified'} className="text-sm text-aegis-primary" />
                    <span>{index === 0 ? 'Expires in 184 days' : 'Verified protocols: 142'}</span>
                  </div>
                </article>
              ))}

              <Link to="/add-security-policy-modal" className="dashboard-card flex min-h-[196px] flex-col items-center justify-center border-dashed text-center transition-colors hover:border-aegis-primary/25 hover:bg-white/[0.03]">
                <Icon name="add_moderator" className="mb-3 text-3xl text-aegis-text-muted/45" />
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-aegis-text-muted hover:text-aegis-primary">Add security policy</div>
              </Link>
            </div>
          </section>
        </div>

        <div className="xl:col-span-4 xl:row-span-2">
          <section className="surface-glass h-full rounded-xl border border-white/10 p-8 shadow-2xl shadow-black/30">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-aegis-text">Propose Action</h2>
              <Icon name="bolt" className="text-2xl text-aegis-primary" />
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <FieldLabel>Amount</FieldLabel>
                <UnderlinedTextInput
                  value={actionComposer.amount}
                  onChange={(event) => updateActionField('amount', event.target.value)}
                  className="mt-2 text-3xl font-headline font-extrabold tracking-tight"
                  placeholder="0.00"
                />
              </div>

              <div>
                <FieldLabel>Asset</FieldLabel>
                <div className="relative mt-2">
                  <UnderlinedSelectInput
                    value={actionComposer.asset}
                    onChange={(event) => updateActionField('asset', event.target.value as (typeof assetOptions)[number])}
                    className="appearance-none pr-8"
                  >
                    {assetOptions.map((asset) => (
                      <option key={asset} value={asset}>
                        {asset}
                      </option>
                    ))}
                  </UnderlinedSelectInput>
                  <Icon name="expand_more" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-base text-aegis-text-muted" />
                </div>
              </div>

              <div>
                <FieldLabel>Destination address</FieldLabel>
                <UnderlinedTextInput
                  value={actionComposer.destination}
                  onChange={(event) => updateActionField('destination', event.target.value)}
                  className="mt-2 font-mono text-sm"
                  placeholder="0x... or approved destination"
                />
              </div>

              <div>
                <FieldLabel>Strategic reason</FieldLabel>
                <UnderlinedTextArea
                  value={actionComposer.reason}
                  onChange={(event) => updateActionField('reason', event.target.value)}
                  className="mt-2 min-h-24"
                  placeholder="Explain the rationale for this treasury movement..."
                />
              </div>

              <div className="rounded-xl border border-aegis-secondary/15 bg-aegis-secondary/5 p-4 text-sm leading-6 text-aegis-text-muted">
                <div className="flex flex-wrap gap-2">
                  <Badge tone="warning">Private lane</Badge>
                  <Badge tone="info">Public-safe lane</Badge>
                  <Badge tone="neutral">Receipt attached</Badge>
                </div>
                <p className="mt-4">Private reasoning stays confidential, a bounded public-safe summary is generated for review, and the completed evaluation is retained in local session history for the decision flow.</p>
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
                  onClick={() => {
                    setForm({ ...demoEvaluationDraft })
                    setActionComposer(deriveActionComposer(demoEvaluationDraft.proposedAction))
                  }}
                >
                  Reset demo inputs
                </Button>
              </div>

              <details className="rounded-xl border border-white/6 bg-black/20 p-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-aegis-text">
                  Private evaluation context
                  <span className="text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Confidential</span>
                </summary>
                <div className="mt-4 space-y-4">
                  <div>
                    <FieldLabel>Treasury policy</FieldLabel>
                    <TextArea
                      value={form.treasuryPolicy}
                      onChange={(event) => setForm((current) => ({ ...current, treasuryPolicy: event.target.value }))}
                      className="mt-2 min-h-24 rounded-lg border-white/6 bg-black/25 text-sm"
                      placeholder="Paste the confidential treasury policy or guardrail excerpts here."
                    />
                  </div>

                  <div>
                    <FieldLabel>Treasury state</FieldLabel>
                    <TextArea
                      value={form.treasuryState}
                      onChange={(event) => setForm((current) => ({ ...current, treasuryState: event.target.value }))}
                      className="mt-2 min-h-20 rounded-lg border-white/6 bg-black/25 text-sm"
                      placeholder="Describe reserves, runway, concentration, and operator context."
                    />
                  </div>
                </div>
              </details>
            </form>
          </section>
        </div>
      </div>
    </ConsoleLayout>
  )
}
