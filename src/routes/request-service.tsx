import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { supportServices } from '~/content/aegis'

export const Route = createFileRoute('/request-service')({
  component: RequestServicePage,
})

export function RequestServicePage() {
  return (
    <ConsoleLayout
      eyebrow="Demo-grade concierge artifact"
      title="Service Intake Preview"
      description="This route is a polished intake preview, not a live service request pipeline. Keep it presentational and explicit so judges do not mistake it for a wired sales or support workflow."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="warning">Demo-grade artifact surface</Badge>}
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <section className="space-y-10 lg:col-span-8">
          <div className="rounded-2xl border border-aegis-warning/20 bg-aegis-warning/8 p-5 text-sm leading-7 text-aegis-text-muted">
            <div className="flex flex-wrap gap-2">
              <Badge tone="warning">Not part of today's MVP</Badge>
              <Badge tone="neutral">No submit handler wired</Badge>
            </div>
            <p className="mt-4">
              Treat this as a submission preview of a future concierge intake. The live product story today remains the single evaluation loop and published trust surfaces.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-aegis-text">
              <span className="h-2 w-2 bg-aegis-primary" />
              1. Service Protocol
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {supportServices.map((service, index) => (
                <label
                  key={service.name}
                  className={`relative flex cursor-pointer flex-col border p-6 transition-all ${index === 0 ? 'border-aegis-primary/30 bg-aegis-shell' : 'border-white/10 bg-black/20 hover:bg-aegis-shell'}`}
                >
                  <input checked={index === 0} readOnly className="absolute right-4 top-4 h-4 w-4 accent-[#2dd4bf]" name="service" type="radio" />
                  <Icon name={service.icon} className={`mb-4 text-3xl ${index === 0 ? 'text-aegis-primary' : 'text-aegis-text-muted'}`} />
                  <span className="mb-1 font-bold text-aegis-text">{service.name}</span>
                  <span className="text-xs leading-6 text-aegis-text-muted">{service.description}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-l border-aegis-primary/20 bg-aegis-shell p-8">
            <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-aegis-text">
              <span className="h-2 w-2 bg-aegis-primary" />
              2. Engagement Parameters
            </h2>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <label className="field-label">Treasury Size (USD)</label>
                <select className="field-control-underlined mt-2" defaultValue="$10M - $50M">
                  <option>$1M - $10M</option>
                  <option>$10M - $50M</option>
                  <option>$50M - $250M</option>
                  <option>$250M+</option>
                </select>
              </div>
              <div>
                <label className="field-label">Urgency Level</label>
                <select className="field-control-underlined mt-2" defaultValue="Priority (48-72 hours)">
                  <option>Standard (5-7 business days)</option>
                  <option>Priority (48-72 hours)</option>
                  <option>Critical / Immediate</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <label className="field-label">Primary objectives</label>
              <textarea
                className="field-control-underlined mt-2 min-h-32"
                defaultValue="We need a private review of a strategic liquidity allocation before circulating a public summary to the broader governance group."
              />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <input className="h-5 w-5 accent-[#2dd4bf]" id="nda" type="checkbox" />
              <label className="text-sm text-aegis-text-muted" htmlFor="nda">I require a formal non-disclosure agreement (NDA) prior to data exchange.</label>
            </div>

            <div className="mt-8">
              <Button disabled className="w-full justify-center" leftIcon={<Icon name="schedule" className="text-lg" />}>
                Intake workflow coming soon
              </Button>
            </div>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <div className="dashboard-card-muted p-8">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-primary">Preview density panel</p>
            <div className="font-headline text-5xl font-bold tracking-tight text-aegis-text">72%</div>
            <p className="mt-3 text-sm leading-6 text-aegis-text-muted">Illustrative queue load only. There is no live staffing, SLA engine, or prioritization workflow behind this surface yet.</p>
          </div>

          <div className="dashboard-card p-6">
            <h3 className="border-b border-white/8 pb-3 font-headline text-lg font-bold text-aegis-text">The Aegis Guarantee</h3>
            <div className="mt-4 space-y-4">
              {[
                ['shield', "Today's shipped proof point is the evaluator plus hosted demo artifacts, not a staffed concierge operation."],
                ['lock', 'Sensitive policy text stays in the private input lane during the MVP demo flow.'],
                ['history_edu', 'Receipts are public-safe hosted JSON artifacts today, not signed PDFs or legal audit packages.'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-3 text-sm leading-6 text-aegis-text-muted">
                  <Icon name={icon} className="mt-0.5 text-aegis-secondary" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-6">
            <p className="text-xs text-aegis-text-muted">Need immediate help?</p>
            <button className="mt-2 block text-left text-sm font-bold text-aegis-secondary/70" disabled type="button">
              Live concierge chat coming soon
            </button>
            <div className="mt-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-aegis-warning" />
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Desk status: preview only</span>
            </div>
          </div>
        </aside>
      </div>

      <footer className="mt-24 border-t border-white/6 pt-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-aegis-text-muted/55">Demo-grade Stitch-derived intake artifact</p>
      </footer>
    </ConsoleLayout>
  )
}
