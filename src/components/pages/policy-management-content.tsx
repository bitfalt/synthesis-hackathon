import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Icon } from '~/components/ui/icon'
import { policies } from '~/content/aegis'

function toneForStatus(status: 'active' | 'review' | 'draft') {
  if (status === 'active') return 'primary' as const
  if (status === 'review') return 'warning' as const
  return 'info' as const
}

const healthStats = [
  { label: 'Coverage score', value: '92%', helper: '12 active controls mapped' },
  { label: 'Review queue', value: '03', helper: 'Signer approvals pending' },
  { label: 'Override path', value: 'Draft', helper: 'Emergency flow not yet live' },
] as const

const modalPolicyTypes = ['Liquidity', 'Counterparty', 'Sanctions', 'Signer quorum'] as const

export function PolicyManagementContent({ showModal = false }: { showModal?: boolean }) {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {healthStats.map((stat, index) => (
          <div key={stat.label} className={`dashboard-card p-6 ${index === 0 ? 'xl:col-span-2' : ''}`}>
            <div className="text-xs uppercase tracking-[0.18em] text-aegis-text-muted/60">{stat.label}</div>
            <div className={`mt-4 font-headline text-4xl font-bold tracking-tight ${index === 0 ? 'text-aegis-primary' : index === 1 ? 'text-aegis-warning' : 'text-aegis-text'}`}>{stat.value}</div>
            <div className="mt-2 text-sm text-aegis-text-muted">{stat.helper}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="dashboard-card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-white/6 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-headline text-xl font-bold text-aegis-text">Guardrail registry</h2>
              <p className="mt-1 text-sm text-aegis-text-muted">Dense, reviewable policies that shape every private evaluation and public-safe receipt.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-aegis-text-muted hover:bg-white/5" type="button">All controls</button>
              <button className="rounded-lg border border-white/10 px-4 py-2 text-sm text-aegis-text-muted hover:bg-white/5" type="button">Review queue</button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-white/6 bg-aegis-highest/20 text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted/70">
                  <th className="px-6 py-4">Policy</th>
                  <th className="px-6 py-4">Summary</th>
                  <th className="px-6 py-4">State</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((policy, index) => (
                  <tr key={policy.id} className="dashboard-table-row">
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start gap-4">
                        <div className={`grid h-10 w-10 place-items-center rounded-lg ${index % 2 === 0 ? 'bg-aegis-primary/10 text-aegis-primary' : 'bg-aegis-secondary/10 text-aegis-secondary'}`}>
                          <Icon name={index === 1 ? 'policy_alert' : index === 3 ? 'emergency' : 'gavel'} className="text-lg" />
                        </div>
                        <div>
                          <div className="font-semibold text-aegis-text">{policy.name}</div>
                          <div className="mt-1 text-[11px] font-mono text-aegis-text-muted">{policy.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm leading-6 text-aegis-text-muted">{policy.summary}</td>
                    <td className="px-6 py-5 align-top">
                      <Badge tone={toneForStatus(policy.status)}>{policy.status}</Badge>
                    </td>
                    <td className="px-6 py-5 text-right align-top">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary">Inspect</Button>
                        <Button variant="secondary">Edit</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="dashboard-card p-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-headline text-lg font-bold text-aegis-text">Policy stack health</h3>
              <Badge tone="primary">Live sync</Badge>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-white/8 bg-black/20 p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Synced policies</div>
                <div className="mt-3 font-headline text-4xl font-bold text-aegis-primary">9 / 12</div>
              </div>
              <div className="rounded-xl border border-white/8 bg-black/20 p-5">
                <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Review queue</div>
                <div className="mt-3 font-headline text-4xl font-bold text-aegis-warning">3</div>
              </div>
            </div>
            <div className="mt-5 rounded-xl border border-white/8 bg-aegis-highest/25 p-4 text-sm leading-6 text-aegis-text-muted">
              Latest sync: 8 minutes ago. Signer consensus healthy. Emergency override flow still in draft review.
            </div>
          </section>

          <section className="dashboard-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="font-headline text-lg font-bold text-aegis-text">Policy authoring</h3>
              <Icon name="add" className="text-aegis-primary" />
            </div>
            <p className="text-sm leading-6 text-aegis-text-muted">Open the modal state to review the Stitch-inspired authoring flow without changing backend policy storage.</p>
            <Link to="/add-security-policy-modal" className="mt-6 inline-flex">
              <Button>Open security policy modal</Button>
            </Link>
          </section>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-[28px] border border-white/10 bg-[#1a1a1a] shadow-2xl shadow-black/50">
            <div className="border-b border-white/6 px-8 py-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-aegis-primary">Add guardrail</p>
                  <h2 className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-aegis-text">Security policy modal</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-aegis-text-muted">Define a bounded policy check for treasury evaluation, including threshold, severity, and escalation behavior.</p>
                </div>
                <Link to="/policy-management" className="rounded-lg border border-white/10 px-3 py-2 text-sm text-aegis-text-muted hover:bg-white/5">Close</Link>
              </div>
            </div>

            <div className="space-y-6 px-8 py-7">
              <div>
                <div className="mb-3 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Policy type</div>
                <div className="flex flex-wrap gap-2">
                  {modalPolicyTypes.map((type, index) => (
                    <button
                      key={type}
                      className={`rounded-lg border px-4 py-2 text-sm ${index === 0 ? 'border-aegis-primary/30 bg-aegis-primary/10 text-aegis-primary' : 'border-white/10 bg-black/15 text-aegis-text-muted hover:bg-white/5'}`}
                      type="button"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Policy name</div>
                  <div className="rounded-lg border border-white/10 bg-black/15 px-4 py-3 text-sm text-aegis-text">Stable reserve floor</div>
                </div>
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Enforcement</div>
                  <div className="flex items-center justify-between rounded-lg border border-white/10 bg-black/15 px-4 py-3">
                    <span className="text-sm text-aegis-text">Warn + signer review</span>
                    <Badge tone="warning">Escalated</Badge>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-[1fr_180px]">
                <div>
                  <div className="mb-2 text-xs uppercase tracking-[0.18em] text-aegis-text-muted">Rule summary</div>
                  <div className="min-h-32 rounded-lg border border-white/10 bg-black/15 px-4 py-3 text-sm leading-7 text-aegis-text-muted">
                    Trigger a review when a proposed transfer would reduce stable reserve coverage below the 18-month treasury runway floor.
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-aegis-panel p-4">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-aegis-text-muted">Threshold</div>
                  <div className="mt-3 font-headline text-3xl font-bold text-aegis-primary">18m</div>
                  <div className="mt-2 text-sm text-aegis-text-muted">Minimum runway requirement</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-3 border-t border-white/6 pt-6">
                <Button variant="secondary">Save draft policy</Button>
                <Link to="/policy-management" className="inline-flex">
                  <Button>Return to policy management</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
