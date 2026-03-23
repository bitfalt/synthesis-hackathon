import { Link, createFileRoute } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { faqs } from '~/content/aegis'

export const Route = createFileRoute('/help-center')({
  component: HelpCenterPage,
})

const docs = [
  {
    title: 'Agent manifest',
    body: 'Open the published `/.well-known/agent.json` file that describes the current demo service, trust artifacts, and caveats.',
    icon: 'terminal',
    href: '/.well-known/agent.json',
  },
  {
    title: 'x402 discovery',
    body: 'Inspect the live Base/x402 discovery response instead of relying on marketing copy about payment readiness.',
    icon: 'rocket_launch',
    href: '/api/x402/discovery',
  },
  {
    title: 'Screen registry',
    body: 'Review which routed screens are live MVP surfaces versus preserved submission previews.',
    icon: 'gavel',
    href: '/screens',
  },
] as const

export function HelpCenterPage() {
  return (
    <ConsoleLayout
      eyebrow="Operator guidance"
      title="Knowledge & Guidance"
      description="Use this page as an honest guide to the shipped MVP, its trust surfaces, and the routes that remain demo previews. It is not a full documentation portal yet."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="info">Supporting surface</Badge>}
    >
      <div className="space-y-12">
        <section className="rounded-2xl border border-aegis-secondary/18 bg-aegis-secondary/8 p-5 text-sm leading-7 text-aegis-text-muted">
          <div className="flex flex-wrap gap-2">
            <Badge tone="primary">Live MVP loop</Badge>
            <Badge tone="info">Published trust surfaces</Badge>
            <Badge tone="warning">Preview routes labeled in-app</Badge>
          </div>
          <p className="mt-4">
            For judges under time pressure, the core story is simple: submit an evaluation on `/evaluation-dashboard`, inspect the privacy split on `/decision-result`, then review the durable trail on `/evaluation-history`.
          </p>
        </section>

        <section>
          <div className="mb-16 max-w-3xl">
            <h2 className="font-headline text-5xl font-extrabold tracking-tight text-aegis-text">Documentation Hub</h2>
            <p className="mt-4 text-lg leading-8 text-aegis-text-muted">A truthful review hub for the shipped MVP, its preview routes, and the trust surfaces that are actually published today.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-12">
            <article className="dashboard-card relative overflow-hidden p-8 xl:col-span-8">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-aegis-primary">
                    <Icon name="terminal" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Deep dive</span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold text-aegis-text">What is actually shipped</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-aegis-text-muted">Open the published manifest and discovery docs, then follow the live three-step evaluation loop instead of inferring functionality from the broader UI shell.</p>
                </div>
                <a href="/.well-known/agent.json" target="_blank" rel="noreferrer" className="mt-12 inline-flex items-center gap-3 text-sm font-bold text-aegis-primary">
                  <span className="border-b border-aegis-primary/30 pb-1">Open the agent manifest</span>
                  <Icon name="arrow_forward" className="text-sm" />
                </a>
              </div>
              <Icon name="security" className="pointer-events-none absolute -bottom-12 -right-10 text-[18rem] text-white/[0.04]" />
            </article>

            <article className="dashboard-card-muted flex flex-col justify-between p-8 xl:col-span-4">
              <div>
                <Icon name="rocket_launch" className="mb-6 text-4xl text-aegis-warning" />
                <h3 className="font-headline text-2xl font-bold text-aegis-text">Live MVP checklist</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">Use the evaluator, open a result, and verify the durable trail before exploring the preview-only routes.</p>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-aegis-text">
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-aegis-primary" />Run one evaluation from the dashboard</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-aegis-primary" />Inspect the private/public reasoning split</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-aegis-primary" />Open the hosted receipt and log artifacts</li>
              </ul>
            </article>

            {docs.slice(2).map((doc, index) => (
              <a key={doc.title} href={doc.href} target={doc.href.startsWith('/api') || doc.href.startsWith('/.') ? '_blank' : undefined} rel={doc.href.startsWith('/api') || doc.href.startsWith('/.') ? 'noreferrer' : undefined} className={`p-8 ${index === 0 ? 'dashboard-card xl:col-span-6' : 'dashboard-card-muted xl:col-span-6'}`}>
                <Icon name={doc.icon} className={`mb-4 text-4xl ${index === 0 ? 'text-aegis-secondary' : 'text-aegis-danger'}`} />
                <h3 className="font-headline text-2xl font-bold text-aegis-text">{doc.title}</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">{doc.body}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="grid gap-16 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <h4 className="mb-8 flex items-center gap-3 font-headline text-xl font-bold text-aegis-text">
              <span className="h-8 w-2 bg-aegis-primary" />
              Popular Resources
            </h4>
            <div className="space-y-4">
              {[
                ['Agent manifest JSON', 'Live trust surface', 'description', '/.well-known/agent.json'],
                ['x402 discovery document', 'Live service surface', 'verified_user', '/api/x402/discovery'],
                ['Screen registry and route map', 'Reviewer aid', 'hub', '/screens'],
                ['Support preview route', 'Explicitly labeled preview', 'error', '/support-access'],
              ].map(([title, meta, icon, href]) => (
                <a key={title} href={href} target={href.startsWith('/api') || href.startsWith('/.') ? '_blank' : undefined} rel={href.startsWith('/api') || href.startsWith('/.') ? 'noreferrer' : undefined} className="group dashboard-card flex items-center justify-between p-6 transition-colors hover:bg-aegis-highest/45">
                  <div className="flex items-center gap-6">
                    <Icon name={icon} className="text-aegis-text-muted" />
                    <div>
                      <p className="font-medium text-aegis-text">{title}</p>
                      <p className="mt-1 text-xs text-aegis-text-muted">{meta}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-aegis-text-muted transition-colors group-hover:text-aegis-primary" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-10 xl:col-span-4">
            <div className="rounded-xl border border-aegis-primary/20 bg-aegis-primary/5 p-8">
              <h5 className="font-headline text-lg font-bold text-aegis-primary">Need direct assistance?</h5>
              <p className="mt-4 text-sm leading-7 text-aegis-text-muted">The support workspace is a labeled preview route today, but it remains useful for judges who want to see how the broader operator product could expand.</p>
              <Link to="/support-access" className="mt-6 inline-flex w-full">
                <Button className="w-full justify-center" leftIcon={<Icon name="support_agent" className="text-base" />}>Open support preview</Button>
              </Link>
            </div>

            <div>
              <h5 className="mb-6 font-headline text-sm font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Network Health</h5>
              <div className="space-y-4">
                {['Dashboard evaluation loop', 'Receipt publication lane', 'Discovery endpoints'].map((item) => (
                  <div key={item} className="flex items-center justify-between text-xs">
                    <span className="text-aegis-text-muted">{item}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-aegis-primary">Available</span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-aegis-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-aegis-primary">Cryptographic foundation</span>
              <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">Zero-knowledge governance and trust-layer enforcement</h2>
              <p className="mt-4 text-sm leading-7 text-aegis-text-muted">Aegis uses a bounded trust model so policy validation can stay private while receipts and manifests remain inspectable for reviewers.</p>
            </div>
            <div className="hidden gap-2 lg:flex">
              <div className="h-1 w-12 bg-aegis-primary" />
              <div className="h-1 w-12 bg-white/10" />
              <div className="h-1 w-12 bg-white/10" />
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Recursive receipts',
                body: 'Hosted receipt artifacts and decision packages keep each evaluation auditable without widening the current MVP scope.',
                cta: 'OPEN MANIFEST',
                active: true,
                href: '/.well-known/agent.json',
              },
              {
                title: 'TEE hardening',
                body: 'Sensitive treasury policy interpretation stays in the internal lane instead of being serialized into public summaries.',
                cta: 'SUBMISSION PREVIEW',
                active: false,
              },
              {
                title: 'Threshold approvals',
                body: 'Signer-review and quorum logic remain visible as operator-facing controls across the product surface.',
                cta: 'SUBMISSION PREVIEW',
                active: false,
              },
            ].map((item) => (
              <article key={item.title} className={`border-t-2 p-8 ${item.active ? 'border-aegis-primary bg-aegis-foundation' : 'border-white/10 bg-black/15'}`}>
                <h4 className="font-headline text-xl font-bold text-aegis-text">{item.title}</h4>
                <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{item.body}</p>
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noreferrer" className={`mt-6 inline-flex items-center gap-1 text-xs font-bold ${item.active ? 'text-aegis-primary' : 'text-aegis-text-muted'}`}>
                    {item.cta}
                    <Icon name="chevron_right" className="text-sm" />
                  </a>
                ) : (
                  <button className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-aegis-text-muted" disabled type="button">
                    {item.cta}
                    <Icon name="chevron_right" className="text-sm" />
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="dashboard-card-muted p-8">
          <h2 className="font-headline text-2xl font-bold text-aegis-text">Frequently asked questions</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-xl border border-white/8 bg-black/20 p-5">
                <h3 className="text-lg font-semibold text-aegis-text">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ConsoleLayout>
  )
}
