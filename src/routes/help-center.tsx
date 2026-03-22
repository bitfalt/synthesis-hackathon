import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'
import { faqs } from '~/content/aegis'

export const Route = createFileRoute('/help-center')({
  component: HelpCenterPage,
})

const docs = [
  {
    title: 'What is private here?',
    body: 'Private rationale and sensitive policy interpretation stay on the internal side of the product.',
    icon: 'lock',
  },
  {
    title: 'What is public-safe?',
    body: 'Summaries communicate the recommendation without leaking the private internal rule set.',
    icon: 'public',
  },
  {
    title: 'What makes the output trustworthy?',
    body: 'Receipts, manifests, and reviewable logs tied to the Aegis trust layer.',
    icon: 'verified',
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
      <div className="space-y-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="dashboard-card p-8">
            <div className="mb-6 flex items-center gap-3 text-aegis-primary">
              <Icon name="menu_book" className="text-2xl" />
              <span className="eyebrow">Documentation hub</span>
            </div>
            <h2 className="font-headline text-4xl font-extrabold tracking-tight text-aegis-text">Quick documentation</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-aegis-text-muted">The most useful conceptual entry points when reviewing the product quickly, remixed into the denser Stitch help-center layout.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {docs.map((doc) => (
                <article key={doc.title} className="rounded-xl border border-white/8 bg-black/20 p-5">
                  <Icon name={doc.icon} className="text-xl text-aegis-primary" />
                  <h3 className="mt-4 font-headline text-lg font-bold text-aegis-text">{doc.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-aegis-text-muted">{doc.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card-muted p-6">
              <h3 className="font-headline text-lg font-bold text-aegis-text">Support status</h3>
              <div className="mt-4 space-y-3 text-sm text-aegis-text-muted">
                <div className="detail-row"><span>Knowledge base</span><span>Live</span></div>
                <div className="detail-row"><span>Concierge desk</span><span>Priority lane</span></div>
                <div className="detail-row"><span>Receipt docs</span><span>Public-safe</span></div>
              </div>
            </div>
            <div className="dashboard-card p-6">
              <h3 className="font-headline text-lg font-bold text-aegis-text">Get help fast</h3>
              <p className="mt-3 text-sm leading-6 text-aegis-text-muted">Need live operational support instead of docs? Move into the concierge support workspace.</p>
              <div className="mt-5 flex gap-3">
                <Button>Open support</Button>
                <Button variant="secondary">Service docs</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="dashboard-card p-8">
            <h2 className="font-headline text-2xl font-bold text-aegis-text">Implementation guide</h2>
            <div className="mt-6 space-y-4">
              {[
                ['Private reasoning lane', 'Keep sensitive policy interpretation and operator rationale inside the confidential lane.'],
                ['Public-safe lane', 'Expose only bounded recommendation text, provider provenance, and structured artifacts.'],
                ['Trust surfaces', 'Receipts, agent manifests, and hosted logs make the system inspectable.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-xl border border-white/8 bg-black/20 p-5">
                  <div className="text-sm font-bold text-aegis-text">{title}</div>
                  <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card-muted p-8">
            <h2 className="font-headline text-2xl font-bold text-aegis-text">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-xl border border-white/8 bg-black/20 p-5">
                  <h3 className="text-lg font-semibold text-aegis-text">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 text-aegis-text-muted">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </div>
    </ConsoleLayout>
  )
}
