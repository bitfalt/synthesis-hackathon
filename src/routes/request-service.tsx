import { createFileRoute } from '@tanstack/react-router'
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
      eyebrow="Premium concierge"
      title="Request Enterprise Strategic Services"
      description="Secure high-touch support from our sovereign desk. Select from advanced risk evaluations, custom treasury policy architecture, or white-glove institutional onboarding."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <div className="grid gap-12 lg:grid-cols-12">
        <section className="space-y-10 lg:col-span-8">
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
              <Button className="w-full justify-center" leftIcon={<Icon name="arrow_forward" className="text-lg" />}>
                Initiate engagement request
              </Button>
            </div>
          </div>
        </section>

        <aside className="space-y-6 lg:col-span-4">
          <div className="dashboard-card-muted p-8">
            <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-aegis-primary">Current desk load</p>
            <div className="font-headline text-5xl font-bold tracking-tight text-aegis-text">72%</div>
            <p className="mt-3 text-sm leading-6 text-aegis-text-muted">High demand. Priority requests are prioritized for Enterprise Tier members.</p>
          </div>

          <div className="dashboard-card p-6">
            <h3 className="border-b border-white/8 pb-3 font-headline text-lg font-bold text-aegis-text">The Aegis Guarantee</h3>
            <div className="mt-4 space-y-4">
              {[
                ['shield', 'All consultants are multi-layer background checked and bonded.'],
                ['lock', 'Communication is strictly conducted over PGP-encrypted channels.'],
                ['history_edu', 'All evaluations result in a cryptographic PDF proof of audit.'],
              ].map(([icon, text]) => (
                <div key={text} className="flex items-start gap-3 text-sm leading-6 text-aegis-text-muted">
                  <Icon name={icon} className="mt-0.5 text-aegis-secondary" />
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-6">
            <h3 className="font-headline text-lg font-bold text-aegis-text">Expected response package</h3>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-aegis-text-muted">
              <li>ALLOW / WARN / BLOCK recommendation class</li>
              <li>Confidence band and provider provenance</li>
              <li>Private rationale for internal operators</li>
              <li>Public-safe explanation for broader circulation</li>
              <li>Structured trust artifacts and receipts</li>
            </ul>
          </div>
        </aside>
      </div>
    </ConsoleLayout>
  )
}
