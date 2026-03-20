import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Panel } from '~/components/ui/panel'
import { faqs } from '~/content/aegis'

export const Route = createFileRoute('/help-center')({
  component: HelpCenterPage,
})

function HelpCenterPage() {
  return (
    <ConsoleLayout
      eyebrow="Operator guidance"
      title="Help center"
      description="Product and protocol guidance for treasury operators, reviewers, and implementation partners who need a fast understanding of how Aegis is supposed to work."
    >
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Panel>
          <SectionHeading title="Quick documentation" description="The most useful conceptual entry points when reviewing the product quickly." icon="menu_book" />
          <div className="space-y-4 text-sm leading-6 text-aegis-text-muted">
            <div className="rounded-3xl bg-aegis-highest/60 p-5">
              <p className="font-semibold text-aegis-text">What is private here?</p>
              <p className="mt-2">Private rationale and sensitive policy interpretation stay on the internal side of the product.</p>
            </div>
            <div className="rounded-3xl bg-aegis-highest/60 p-5">
              <p className="font-semibold text-aegis-text">What is public-safe?</p>
              <p className="mt-2">Summaries that communicate the recommendation without leaking the private internal rule set.</p>
            </div>
            <div className="rounded-3xl bg-aegis-highest/60 p-5">
              <p className="font-semibold text-aegis-text">What makes the output trustworthy?</p>
              <p className="mt-2">Receipts, manifests, and reviewable logs tied to the Aegis trust layer.</p>
            </div>
          </div>
        </Panel>

        <Panel tone="glass">
          <SectionHeading title="Frequently asked questions" description="The shortest path to product comprehension for judges and operators." icon="help" />
          <div className="space-y-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-3xl bg-black/15 p-5">
                <h3 className="text-lg font-semibold text-aegis-text">{faq.question}</h3>
                <p className="mt-3 text-sm leading-7 text-aegis-text-muted">{faq.answer}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  )
}
