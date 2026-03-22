import { Link, createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { faqs } from '~/content/aegis'

export const Route = createFileRoute('/help-center')({
  component: HelpCenterPage,
})

const docs = [
  {
    title: 'Technical Specifications',
    body: 'Understand the TEE-style reasoning split, receipt surfaces, and trust architecture behind Aegis Treasury.',
    icon: 'terminal',
  },
  {
    title: 'Getting Started',
    body: 'Configure your first vault, key-management policy, and review lane in a fast operator onboarding flow.',
    icon: 'rocket_launch',
  },
  {
    title: 'Policy Configuration',
    body: 'Define governance structures, spending limits, whitelists, and signer review rules.',
    icon: 'gavel',
  },
] as const

export function HelpCenterPage() {
  return (
    <ConsoleLayout
      eyebrow="Operator guidance"
      title="Knowledge & Guidance"
      description="Product and protocol guidance for treasury operators, reviewers, and implementation partners who need a fast understanding of how Aegis works."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <div className="space-y-12">
        <section>
          <div className="mb-16 max-w-3xl">
            <h2 className="font-headline text-5xl font-extrabold tracking-tight text-aegis-text">Documentation Hub</h2>
            <p className="mt-4 text-lg leading-8 text-aegis-text-muted">Expert guidance for institutional-grade digital asset custody, policy architecture, cryptographic trust surfaces, and operational troubleshooting.</p>
          </div>

          <div className="grid gap-6 xl:grid-cols-12">
            <article className="dashboard-card relative overflow-hidden p-8 xl:col-span-8">
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-aegis-primary">
                    <Icon name="terminal" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]">Deep dive</span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold text-aegis-text">Technical Specifications</h3>
                  <p className="mt-4 max-w-md text-sm leading-7 text-aegis-text-muted">Understand our implementation of private reasoning lanes, public-safe trust artifacts, and the architecture that gives Aegis its reviewable operator posture.</p>
                </div>
                <div className="mt-12 inline-flex items-center gap-3 text-sm font-bold text-aegis-primary">
                  <span className="border-b border-aegis-primary/30 pb-1">Read the whitepaper</span>
                  <Icon name="arrow_forward" className="text-sm" />
                </div>
              </div>
              <Icon name="security" className="pointer-events-none absolute -bottom-12 -right-10 text-[18rem] text-white/[0.04]" />
            </article>

            <article className="dashboard-card-muted flex flex-col justify-between p-8 xl:col-span-4">
              <div>
                <Icon name="rocket_launch" className="mb-6 text-4xl text-aegis-warning" />
                <h3 className="font-headline text-2xl font-bold text-aegis-text">Getting Started</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">Configure your organization&apos;s first vault in minutes with a quick-start operator checklist.</p>
              </div>
              <ul className="mt-8 space-y-3 text-xs text-aegis-text">
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-aegis-primary" />Account initialization</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-aegis-primary" />Key management basics</li>
                <li className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-aegis-primary" />Inviting team members</li>
              </ul>
            </article>

            {docs.slice(2).map((doc, index) => (
              <article key={doc.title} className={`p-8 ${index === 0 ? 'dashboard-card xl:col-span-6' : 'dashboard-card-muted xl:col-span-6'}`}>
                <Icon name={doc.icon} className={`mb-4 text-4xl ${index === 0 ? 'text-aegis-secondary' : 'text-aegis-danger'}`} />
                <h3 className="font-headline text-2xl font-bold text-aegis-text">{doc.title}</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">{doc.body}</p>
              </article>
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
                ['Understanding bounded receipts in Aegis', 'Technical Spec • 12 min read', 'description'],
                ['Hardware signer and HSM integration', 'Infrastructure • 8 min read', 'verified_user'],
                ['Multi-signature governance frameworks', 'Policy • 15 min read', 'hub'],
                ['Handling policy rejected transaction errors', 'Troubleshooting • 5 min read', 'error'],
              ].map(([title, meta, icon]) => (
                <article key={title} className="group dashboard-card flex items-center justify-between p-6 transition-colors hover:bg-aegis-highest/45">
                  <div className="flex items-center gap-6">
                    <Icon name={icon} className="text-aegis-text-muted" />
                    <div>
                      <p className="font-medium text-aegis-text">{title}</p>
                      <p className="mt-1 text-xs text-aegis-text-muted">{meta}</p>
                    </div>
                  </div>
                  <Icon name="chevron_right" className="text-aegis-text-muted transition-colors group-hover:text-aegis-primary" />
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-10 xl:col-span-4">
            <div className="rounded-xl border border-aegis-primary/20 bg-aegis-primary/5 p-8">
              <h5 className="font-headline text-lg font-bold text-aegis-primary">Need direct assistance?</h5>
              <p className="mt-4 text-sm leading-7 text-aegis-text-muted">Our priority support team remains available for treasury operators who need immediate review help.</p>
              <Link to="/support-access" className="mt-6 inline-flex w-full">
                <Button className="w-full justify-center" leftIcon={<Icon name="support_agent" className="text-base" />}>Open support ticket</Button>
              </Link>
            </div>

            <div>
              <h5 className="mb-6 font-headline text-sm font-bold uppercase tracking-[0.18em] text-aegis-text-muted">Network Health</h5>
              <div className="space-y-4">
                {['Core settlement layer', 'Receipt publication lane', 'Vault API services'].map((item) => (
                  <div key={item} className="flex items-center justify-between text-xs">
                    <span className="text-aegis-text-muted">{item}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-aegis-primary">Operational</span>
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
                cta: 'VIEW MODULES',
                active: true,
              },
              {
                title: 'TEE hardening',
                body: 'Sensitive treasury policy interpretation stays in the internal lane instead of being serialized into public summaries.',
                cta: 'VIEW ARCHITECTURE',
                active: false,
              },
              {
                title: 'Threshold approvals',
                body: 'Signer-review and quorum logic remain visible as operator-facing controls across the product surface.',
                cta: 'VIEW PROTOCOL',
                active: false,
              },
            ].map((item) => (
              <article key={item.title} className={`border-t-2 p-8 ${item.active ? 'border-aegis-primary bg-aegis-foundation' : 'border-white/10 bg-black/15'}`}>
                <h4 className="font-headline text-xl font-bold text-aegis-text">{item.title}</h4>
                <p className="mt-4 text-sm leading-7 text-aegis-text-muted">{item.body}</p>
                <button className={`mt-6 inline-flex items-center gap-1 text-xs font-bold ${item.active ? 'text-aegis-primary' : 'text-aegis-text-muted'}`} type="button">
                  {item.cta}
                  <Icon name="chevron_right" className="text-sm" />
                </button>
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
