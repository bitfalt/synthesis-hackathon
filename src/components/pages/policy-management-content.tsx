import { Link } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Panel } from '~/components/ui/panel'
import { SectionHeading } from '~/components/layout/section-heading'
import { policies } from '~/content/aegis'
import { Icon } from '~/components/ui/icon'

function toneForStatus(status: 'active' | 'review' | 'draft') {
  if (status === 'active') return 'primary' as const
  if (status === 'review') return 'warning' as const
  return 'info' as const
}

export function PolicyManagementContent({ showModal = false }: { showModal?: boolean }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <SectionHeading
            title="Guardrail registry"
            description="High-confidence treasury policies that shape every private evaluation and service response."
            icon="gavel"
          />
          <div className="space-y-4">
            {policies.map((policy) => (
              <article key={policy.id} className="rounded-3xl bg-aegis-highest/70 p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-aegis-text font-headline">{policy.name}</h3>
                      <Badge tone={toneForStatus(policy.status)}>{policy.status}</Badge>
                    </div>
                    <p className="mt-2 text-sm text-aegis-text-muted">{policy.id}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-aegis-text-muted">{policy.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary">Inspect</Button>
                    <Button variant="ghost">Edit</Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel tone="glass">
            <SectionHeading
              title="Policy stack health"
              description="A concise snapshot of guardrail freshness, policy drift, and signer awareness."
              icon="shield"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-black/20 p-4">
                <p className="eyebrow text-aegis-text-muted">Synced policies</p>
                <p className="mt-3 text-4xl font-extrabold text-aegis-primary font-headline">9 / 12</p>
              </div>
              <div className="rounded-3xl bg-black/20 p-4">
                <p className="eyebrow text-aegis-text-muted">Review queue</p>
                <p className="mt-3 text-4xl font-extrabold text-aegis-warning font-headline">3</p>
              </div>
            </div>
            <div className="mt-5 rounded-3xl bg-aegis-highest/60 p-4 text-sm leading-6 text-aegis-text-muted">
              Latest sync: 8 minutes ago • Signer consensus healthy • Emergency override flow still in draft review.
            </div>
          </Panel>

          <Panel>
            <SectionHeading
              title="Policy authoring"
              description="Create a new rule without leaving the operating console."
              icon="add"
            />
            <Link to="/add-security-policy-modal" className="inline-flex">
              <Button leftIcon={<Icon name="add" className="text-lg" />}>Open security policy modal</Button>
            </Link>
          </Panel>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="surface-glass ghost-outline w-full max-w-2xl rounded-[32px] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-aegis-primary/80">Add guardrail</p>
                <h2 className="mt-2 text-2xl font-bold text-aegis-text font-headline">Security policy modal</h2>
                <p className="mt-3 text-sm leading-6 text-aegis-text-muted">
                  Define a new bounded policy check for treasury evaluation, including threshold, rationale, and escalation behavior.
                </p>
              </div>
              <Link to="/policy-management" className="btn-ghost text-sm">Close</Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-aegis-highest/70 p-4">
                <p className="field-label">Policy name</p>
                <div className="field-control mt-2">Stable reserve floor</div>
              </div>
              <div className="rounded-3xl bg-aegis-highest/70 p-4">
                <p className="field-label">Severity</p>
                <div className="field-control mt-2">WARN + signer review</div>
              </div>
              <div className="sm:col-span-2 rounded-3xl bg-aegis-highest/70 p-4">
                <p className="field-label">Rule summary</p>
                <div className="field-control mt-2 min-h-28">
                  Trigger a review when a proposed transfer would reduce stable reserve coverage below the 18-month treasury runway floor.
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Save draft policy</Button>
              <Link to="/policy-management" className="inline-flex">
                <Button variant="secondary">Return to policy management</Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
