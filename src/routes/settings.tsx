import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

const notificationRows = [
  ['Email alerts', 'Weekly performance reports'],
  ['Real-time signals', 'Large asset movement'],
  ['Webhook integration', 'Secure guardrail event feed'],
] as const

export function SettingsPage() {
  return (
    <ConsoleLayout
      eyebrow="System controls"
      title="System Controls"
      description="Configure the parameters of your sovereign institution. High-security actions require multi-signature authorization from designated vault guardians."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <div className="grid gap-8 xl:grid-cols-12">
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
                <input className="field-control-underlined mt-2" defaultValue="Aegis Global Treasury KG" />
              </div>
              <div>
                <label className="field-label">Fiscal residency</label>
                <select className="field-control-underlined mt-2" defaultValue="Switzerland | CH">
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
                  <button className="rounded-md border border-aegis-primary/20 bg-aegis-primary/10 px-4 py-2 text-sm font-medium text-aegis-primary" type="button">USDC</button>
                  <button className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-aegis-text-muted" type="button">USD</button>
                  <button className="rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-aegis-text-muted" type="button">EUR</button>
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
              <Badge tone="primary">Active</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-aegis-warning/10 bg-aegis-warning/5 p-3">
              <span className="text-sm font-medium text-aegis-text">Guardian quorum</span>
              <Badge tone="warning">3 of 5</Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <span className="text-sm font-medium text-aegis-text">API isolation</span>
              <Badge tone="neutral">Standard</Badge>
            </div>
          </div>
          <Button variant="secondary" className="mt-8 w-full justify-center">Run audit report</Button>
        </section>

        <section className="dashboard-card p-8 xl:col-span-5">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="font-headline text-xl font-bold text-aegis-text">Connected Vaults</h2>
            <button className="text-xs font-bold uppercase tracking-[0.18em] text-aegis-primary" type="button">+ Link new</button>
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
                    <Badge tone="primary">Synced</Badge>
                  </div>
                  <p className="mt-1 text-[11px] font-mono text-aegis-secondary">{address}</p>
                </div>
                <Icon name="more_vert" className="text-aegis-text-muted" />
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card p-8 xl:col-span-7">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-headline text-xl font-bold text-aegis-text">Security &amp; Auth</h2>
              <p className="mt-1 text-sm text-aegis-text-muted">Live runtime surfaces reflected truthfully from the current MVP.</p>
            </div>
            <Button variant="secondary">Generate new</Button>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border border-white/8 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-aegis-text">API key management</p>
                  <p className="text-xs text-aegis-text-muted">Read-only keys for external reporting services.</p>
                </div>
                <Badge tone="neutral">2 slots</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/6 pt-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-aegis-text-muted">Key name</div>
                  <div className="mt-1 text-sm font-mono text-aegis-text">org-reporting-primary_***_f1</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-aegis-primary" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <RuntimeCard title="Venice reasoning lane" badge="Optional env" tone="warning" body="Live Venice reasoning uses VENICE_API_KEY and defaults to qwen3-5-9b unless VENICE_MODEL is overridden. Without credentials, the MVP uses deterministic fallback wording." />
              <RuntimeCard title="ERC-8004 receipt mode" badge="Hosted demo" tone="info" body="The build publishes /.well-known/agent.json and hosted JSON receipt/log endpoints, but the artifacts are still unsigned demo surfaces." />
              <RuntimeCard title="Base service layer" badge="Discovery live" tone="info" body="The service exposes Base-aware discovery at /api/x402/discovery, /.well-known/x402, and /api/evaluate/service while settlement remains outside the current UI." />
            </div>
          </div>
        </section>

        <section className="dashboard-card p-8 xl:col-span-12">
          <h2 className="font-headline text-xl font-bold text-aegis-text">Notification Preferences</h2>
          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {notificationRows.map(([title, subtitle], index) => (
              <div key={title} className="rounded-xl border border-white/8 bg-black/20 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon name={index === 0 ? 'mail' : index === 1 ? 'campaign' : 'webhook'} className="text-aegis-primary" />
                    <div>
                      <div className="text-sm font-bold text-aegis-text">{title}</div>
                      <div className="text-xs text-aegis-text-muted">{subtitle}</div>
                    </div>
                  </div>
                  <div className="h-5 w-9 rounded-full bg-aegis-primary/90 p-0.5">
                    <div className="ml-auto h-4 w-4 rounded-full bg-aegis-foundation" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/6 pt-6">
            <p className="text-xs text-aegis-text-muted">Last updated: Oct 24, 2023 at 14:22 UTC</p>
            <div className="flex gap-3">
              <Button variant="secondary">Discard changes</Button>
              <Button>Save all modifications</Button>
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
