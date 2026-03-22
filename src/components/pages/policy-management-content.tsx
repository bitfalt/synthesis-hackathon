import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { policies } from '~/content/aegis'

const policyRows = [
  {
    id: 'POL-882-901',
    title: 'Daily Withdrawal Cap',
    domain: 'Tier 1 Liquid',
    enforcement: 'Immediate Block',
    status: 'Active',
    triggeredAt: 'Oct 24, 2023 • 14:22 UTC',
    note: 'Flagged: 50,000 USDC attempt',
    icon: 'payments',
    accent: 'text-aegis-primary',
    rowClass: 'bg-aegis-shell',
  },
  {
    id: 'POL-112-004',
    title: 'Exchange Whitelist Only',
    domain: 'Institutional',
    enforcement: 'Pre-Approval',
    status: 'Active',
    triggeredAt: 'Nov 02, 2023 • 09:12 UTC',
    note: 'Verified: Kraken Prime',
    icon: 'verified',
    accent: 'text-aegis-secondary',
    rowClass: 'bg-aegis-panel',
  },
  {
    id: 'POL-991-332',
    title: 'Admin 3/5 Quorum',
    domain: 'Core Protocol',
    enforcement: 'Consensus Required',
    status: 'Active',
    triggeredAt: 'Oct 28, 2023 • 22:59 UTC',
    note: 'Signed by: Alice, Bob, Charlie',
    icon: 'group_work',
    accent: 'text-aegis-warning',
    rowClass: 'bg-aegis-shell',
  },
  {
    id: 'POL-002-X',
    title: 'Legacy ERC-20 Support',
    domain: 'Deprecated',
    enforcement: 'No Enforcement',
    status: 'Paused',
    triggeredAt: 'Jan 12, 2023 • 12:00 UTC',
    note: 'Last active session',
    icon: 'history_toggle_off',
    accent: 'text-aegis-text-muted/70',
    rowClass: 'bg-aegis-panel opacity-60 grayscale-[0.3]',
  },
] as const

const modalArchitectures = [
  { title: 'Velocity Limit', body: 'Cap total volume per timeframe', icon: 'speed', active: true },
  { title: 'Whitelist', body: 'Restrict assets to approved list', icon: 'verified', active: false },
] as const

export function PolicyManagementContent({ showModal = false }: { showModal?: boolean }) {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 xl:grid-cols-12">
        <div className="dashboard-card relative overflow-hidden p-8 xl:col-span-8">
          <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-aegis-primary/5 blur-3xl" />
          <div className="relative z-10">
            <h3 className="font-headline text-xl font-bold text-aegis-text">Critical security coverage</h3>
            <div className="mt-6 grid gap-8 md:grid-cols-3">
              {[
                ['Whitelisting', '98.2%', 'w-[98%]'],
                ['Multi-Sig Sync', '100%', 'w-full'],
                ['Velocity Limit', 'Active', 'w-full'],
              ].map(([label, value, width]) => (
                <div key={label}>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-aegis-text-muted">{label}</div>
                  <div className="mt-2 font-headline text-2xl font-bold text-aegis-text">{value}</div>
                  <div className="mt-3 h-1 w-full bg-aegis-highest">
                    <div className={`h-full bg-aegis-primary shadow-[0_0_8px_rgba(87,241,219,0.35)] ${width}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-aegis-primary p-8 text-zinc-950 xl:col-span-4">
          <Icon name="bolt" className="mb-4 text-4xl" />
          <h3 className="font-headline text-2xl font-extrabold leading-tight">Instant enforcement is active</h3>
          <p className="mt-4 text-sm leading-7 text-zinc-900/75">All outbound transactions are currently subject to the Vault Prime policy set.</p>
          <div className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-zinc-900/55">{policies.length + 10} active guardrails</div>
        </div>
      </section>

      <section className="border-b border-white/6">
        <div className="flex flex-wrap gap-8 text-sm">
          <button className="border-b-2 border-aegis-primary pb-4 font-bold text-aegis-text" type="button">Active policies (8)</button>
          <button className="pb-4 font-medium text-aegis-text-muted hover:text-aegis-text" type="button">Drafts (3)</button>
          <button className="pb-4 font-medium text-aegis-text-muted hover:text-aegis-text" type="button">Archived (12)</button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-12 px-6 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted/65">
          <div className="col-span-12 md:col-span-4">Policy name &amp; ID</div>
          <div className="col-span-4 hidden md:block">Enforcement</div>
          <div className="col-span-2 hidden md:block">Status</div>
          <div className="col-span-2 hidden md:block">Last triggered</div>
        </div>

        {policyRows.map((policy) => (
          <article key={policy.id} className={`grid grid-cols-1 gap-5 px-6 py-6 md:grid-cols-12 md:items-center ${policy.rowClass}`}>
            <div className="md:col-span-4">
              <div className="flex items-center gap-4">
                <div className="grid h-10 w-10 place-items-center bg-black/25">
                  <Icon name={policy.icon} className={policy.accent} />
                </div>
                <div>
                  <div className="text-sm font-semibold text-aegis-text">{policy.title}</div>
                  <div className="mt-1 text-xs text-aegis-text-muted">{policy.id} • {policy.domain}</div>
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <span className="inline-flex px-2 py-1 text-xs font-medium uppercase tracking-[0.16em] text-aegis-primary bg-aegis-primary/10">{policy.enforcement}</span>
            </div>
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 text-xs text-aegis-text">
                <span className="h-1.5 w-1.5 rounded-full bg-aegis-primary shadow-[0_0_6px_rgba(87,241,219,0.8)]" />
                <span>{policy.status}</span>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="text-sm text-aegis-text">{policy.triggeredAt}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-aegis-text-muted">{policy.note}</div>
            </div>
            <div className="flex justify-end md:col-span-1">
              <button className="rounded-lg p-2 text-aegis-text-muted hover:bg-white/[0.03] hover:text-aegis-text" type="button">
                <Icon name="more_vert" />
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-card flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-12">
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Audit trail</p>
            <div className="flex items-center gap-2 text-sm text-aegis-text-muted">
              <Icon name="cloud_done" className="text-aegis-primary" />
              <span>Syncing with mainnet node 4</span>
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Draft sandbox</p>
            <div className="text-sm text-aegis-text-muted">3 proposals pending review</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button variant="secondary">Export config</Button>
          <Link to="/add-security-policy-modal" className="inline-flex">
            <Button>Simulate batch update</Button>
          </Link>
        </div>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
          <div className="surface-glass relative w-full max-w-xl overflow-hidden rounded-lg border border-white/10 shadow-2xl shadow-black/60">
            <div className="flex items-start justify-between px-8 pb-6 pt-8">
              <div>
                <h3 className="font-headline text-2xl font-bold tracking-tight text-aegis-text">Add Security Policy</h3>
                <p className="mt-1 text-xs text-aegis-text-muted">Configure automated governance guardrails for your treasury vault.</p>
              </div>
              <Link to="/policy-management" className="rounded-lg p-2 text-aegis-text-muted transition-colors hover:text-aegis-text">
                <Icon name="close" />
              </Link>
            </div>

            <form className="space-y-8 px-8 pb-10">
              <div className="space-y-4">
                <label className="field-label text-aegis-primary/85">Identity &amp; naming</label>
                <div className="relative">
                  <input className="field-control-underlined pr-10 text-lg" placeholder="e.g. Daily Operations Cap" type="text" />
                  <Icon name="label" className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-xl text-aegis-text-muted/50" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="field-label text-aegis-primary/85">Policy architecture</label>
                <div className="grid grid-cols-2 gap-3">
                  {modalArchitectures.map((item) => (
                    <button
                      key={item.title}
                      className={`flex flex-col items-start p-4 text-left transition-all ${item.active ? 'border border-aegis-primary/20 bg-aegis-primary/10 text-aegis-text' : 'border border-white/10 bg-aegis-panel text-aegis-text-muted hover:bg-aegis-highest/40'}`}
                      type="button"
                    >
                      <Icon name={item.icon} className={`mb-2 ${item.active ? 'text-aegis-primary' : 'text-aegis-text-muted'}`} />
                      <span className="text-sm font-bold">{item.title}</span>
                      <span className="mt-1 text-[10px]">{item.body}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="field-label text-aegis-primary/85">Control thresholds</label>
                <div className="dashboard-card p-6">
                  <div className="flex items-center justify-between gap-4 border-b border-white/6 pb-6">
                    <div>
                      <span className="block text-sm font-semibold text-aegis-text">Maximum withdrawal</span>
                      <span className="text-xs text-aegis-text-muted">Single transaction upper bound</span>
                    </div>
                    <div className="flex items-end gap-2">
                      <input className="w-24 border-0 border-b border-white/10 bg-transparent px-0 text-right font-headline text-xl font-bold text-aegis-primary outline-none" defaultValue="50,000" type="text" />
                      <span className="pb-1 text-xs font-bold text-aegis-text-muted">USDT</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-6">
                    <div>
                      <span className="block text-sm font-semibold text-aegis-text">Time window</span>
                      <span className="text-xs text-aegis-text-muted">Rolling period for velocity reset</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {['24h', '7d', '30d'].map((window, index) => (
                        <button key={window} className={`rounded-sm px-3 py-1 text-xs font-bold ${index === 0 ? 'bg-aegis-highest text-aegis-primary' : 'border border-white/10 text-aegis-text-muted hover:bg-white/[0.03]'}`} type="button">
                          {window}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Link to="/policy-management" className="text-sm font-bold uppercase tracking-[0.18em] text-aegis-text-muted transition-colors hover:text-aegis-text">
                  Cancel
                </Link>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded border border-aegis-primary/10 bg-aegis-primary/5 px-3 py-1">
                    <Icon name="security" className="text-xs text-aegis-primary" />
                    <span className="text-[10px] font-bold uppercase text-aegis-primary">Hard enforcement</span>
                  </div>
                  <Button>Activate policy</Button>
                </div>
              </div>
            </form>

            <Icon name="lock_reset" className="pointer-events-none absolute -bottom-10 -right-10 text-[150px] text-white/5" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
