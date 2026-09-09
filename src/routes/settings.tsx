import { createFileRoute } from '@tanstack/react-router'
import { OperatorSessionCard } from '~/components/operator/operator-session-card'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

const notificationRows = [
  ['Email alerts', ['Weekly performance report', 'New governance proposals'], 'mail'],
  ['Real-time signals', ['Transaction pending signing', 'Large asset movement'], 'message'],
  ['Webhook integration', ['https://api.internal.vault/webhooks', 'Events: tx_initiated, tx_confirmed, protocol_warning'], 'terminal'],
] as const

export function SettingsPage() {
  return (
    <ConsoleLayout
      eyebrow="System controls"
      title="Runtime Disclosures & Settings Preview"
      description="The runtime cards on this page reflect the current MVP honestly. Most other controls remain non-persistent UI previews and are labeled that way to avoid overstating product readiness."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="info">Supporting surface</Badge>}
    >
      <div className="grid gap-8 xl:grid-cols-12">
        <section className="rounded-2xl border border-aegis-warning/20 bg-aegis-warning/8 p-5 text-sm leading-7 text-aegis-text-muted xl:col-span-12">
          <div className="flex flex-wrap gap-2">
            <Badge tone="info">Runtime status cards are real</Badge>
            <Badge tone="warning">Form controls are not persisted</Badge>
          </div>
          <p className="mt-4">
            Use this page to inspect the honest state of Venice, receipt publication, and x402 discovery. Do not treat the editable organization, vault, and notification controls as shipped account-management functionality yet.
          </p>
        </section>

        <section className="dashboard-card p-8 xl:col-span-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-aegis-primary/10 text-aegis-primary">
              <Icon name="corporate_fare" className="text-2xl" />
            </div>
            <div>
              <h2 className="font-headline text-xl font-bold text-aegis-text">Organization Settings</h2>
              <p className="text-sm text-aegis-text-muted">Core identity and fiscal reporting standards.</p>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label className="field-label">Entity legal name</label>
                <input className="field-control-underlined mt-2" defaultValue="Aegis Global Treasury KG" readOnly />
              </div>
              <div>
                <label className="field-label">Fiscal residency</label>
                <select className="field-control-underlined mt-2" defaultValue="Switzerland | CH" disabled>
                  <option>Switzerland | CH</option>
                  <option>Singapore | SG</option>
                  <option>Cayman Islands | KY</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="field-label">Reporting currency</label>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-md border border-aegis-primary/20 bg-aegis-primary/10 px-4 py-2 text-sm font-medium text-aegis-primary" type="button" disabled>USDC</button>
                  <button className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-aegis-text-muted" type="button" disabled>USD</button>
                  <button className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-aegis-text-muted" type="button" disabled>EUR</button>
                </div>
              </div>
              <div className="rounded-xl border border-white/8 bg-aegis-highest/15 p-4">
                <div className="flex gap-3 text-sm leading-6 text-aegis-text-muted">
                  <Icon name="info" className="mt-0.5 text-aegis-secondary" />
                  <p>Changes to reporting currency will trigger a re-index of historical transaction data. This may take up to 4 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card-muted p-8 xl:col-span-4">
          <h2 className="font-headline text-lg font-bold text-aegis-text">Security Posture</h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-aegis-primary/10 bg-aegis-primary/5 p-3">
              <span className="text-sm font-medium text-aegis-text">2FA Enforcement</span>
              <Badge tone="info">Preview only</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-aegis-warning/10 bg-aegis-warning/5 p-3">
              <span className="text-sm font-medium text-aegis-text">Guardian quorum</span>
              <Badge tone="warning">Reference only</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <span className="text-sm font-medium text-aegis-text">API isolation</span>
              <Badge tone="neutral">Preview only</Badge>
            </div>
          </div>
          <Button variant="secondary" disabled className="mt-8 w-full justify-center">Audit tooling coming soon</Button>
        </section>

        <section className="dashboard-card p-8 xl:col-span-5">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-headline text-xl font-bold text-aegis-text">Connected Vaults</h2>
            <button className="text-xs font-bold uppercase tracking-[0.18em] text-aegis-primary/60" disabled type="button">Linking coming soon</button>
          </div>
          <div className="space-y-4">
            {[
              ['Fireblocks Mainnet', '0x82...49f2'],
              ['Gnosis Safe Treasury', '0x1a...f92b'],
            ].map(([name, address]) => (
              <div key={name} className="flex items-center gap-4 rounded-lg border border-white/6 bg-black/20 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-md bg-black/30 text-aegis-text-muted">
                  <Icon name="account_balance" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-bold text-aegis-text">{name}</h3>
                    <Badge tone="info">Preview row</Badge>
                  </div>
                  <p className="mt-1 text-[11px] font-mono text-aegis-secondary">{address}</p>
                </div>
                <Icon name="more_vert" className="text-aegis-text-muted" />
              </div>
            ))}
          </div>
        </section>

        <OperatorSessionCard />

        <section className="dashboard-card p-8 xl:col-span-5">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-headline text-xl font-bold text-aegis-text">Runtime disclosures</h2>
              <p className="mt-1 text-sm text-aegis-text-muted">Live service and trust surfaces reflected truthfully from the current MVP.</p>
            </div>
            <Button variant="secondary" disabled>Generation coming soon</Button>
          </div>

          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-1 xl:grid-cols-1">
              <RuntimeCard title="Venice reasoning lane" badge="Optional env" tone="warning" body="Live Venice reasoning uses VENICE_API_KEY and defaults to qwen3-5-9b unless VENICE_MODEL is overridden. Without credentials, the MVP uses deterministic fallback wording." />
              <RuntimeCard title="ERC-8004 receipt mode" badge="Hosted demo" tone="info" body="The build publishes /.well-known/agent.json and hosted JSON receipt/log endpoints, but the artifacts are still unsigned demo surfaces." />
              <RuntimeCard title="Base service layer" badge="Discovery live" tone="info" body="The service exposes Base-aware discovery at /api/x402/discovery, /.well-known/x402, and /api/evaluate/service. It defaults to open-demo mode unless x402 payment negotiation is explicitly enabled by env." />
            </div>
          </div>
        </section>

        <section className="dashboard-card p-8 xl:col-span-12">
          <h2 className="font-headline text-xl font-bold text-aegis-text">Notification Preferences</h2>
          <div className="mt-8 grid gap-12 lg:grid-cols-3">
            {notificationRows.map(([title, values, icon]) => (
              <div key={title} className="space-y-6">
                <div className="flex items-center gap-3 text-aegis-primary">
                  <Icon name={icon} />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-aegis-text">{title}</span>
                </div>
                {title === 'Webhook integration' ? (
                  <div className="space-y-2">
                    <input className="field-control-underlined py-2 text-xs" defaultValue={values[0]} readOnly />
                    <p className="text-[10px] text-aegis-text-muted/60">{values[1]}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {values.map((value) => (
                      <div key={value} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-aegis-text">{value}</span>
                        <input checked className="h-4 w-4 rounded-sm accent-[#2dd4bf]" disabled readOnly type="checkbox" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/6 pt-6">
            <p className="text-xs text-aegis-text-muted">Most controls here are visual only in today's submission build.</p>
            <div className="flex gap-3">
              <Button variant="secondary" disabled>Discard unavailable</Button>
              <Button disabled>Save unavailable</Button>
            </div>
          </div>
        </section>
    </div>
    </ConsoleLayout>
  )
}

function RuntimeCard({ title, badge, tone, body }: { title: string; badge: string; tone: 'warning' | 'info'; body: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-bold text-aegis-text">{title}</h3>
        <Badge tone={tone}>{badge}</Badge>
      </div>
      <p className="mt-4 text-sm leading-6 text-aegis-text-muted">{body}</p>
    </div>
  )
}
