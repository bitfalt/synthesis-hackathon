import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Panel } from '~/components/ui/panel'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/support-access')({
  component: SupportAccessPage,
})

function SupportAccessPage() {
  return (
    <ConsoleLayout
      eyebrow="Operator support"
      title="Support access"
      description="A private support surface for teams who need concierge guidance, escalation channels, or implementation help while operating Aegis."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel>
          <SectionHeading title="Access channels" description="Choose the support lane that matches urgency and sensitivity." icon="support_agent" />
          <div className="space-y-4">
            {[
              ['Priority review desk', 'Best for strategic treasury requests that need fast human review.'],
              ['Implementation support', 'Best for policy wiring, dashboard usage, and service integration.'],
              ['Security escalation lane', 'Best for suspicious requests, override disputes, or emergency treasury incidents.'],
            ].map(([title, desc]) => (
              <article key={title} className="rounded-3xl bg-aegis-highest/60 p-5">
                <h3 className="text-lg font-semibold text-aegis-text">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{desc}</p>
              </article>
            ))}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel tone="glass">
            <SectionHeading title="Service-level guidance" description="Support should feel institutional, bounded, and trustworthy." icon="shield" />
            <div className="detail-list">
              <div className="detail-row"><span>Default response window</span><span>24–48 hours</span></div>
              <div className="detail-row"><span>Priority lane</span><span>4–8 hours</span></div>
              <div className="detail-row"><span>Critical lane</span><span>Immediate escalation</span></div>
            </div>
          </Panel>
          <Panel>
            <SectionHeading title="Request support" description="Start the support workflow from the same product shell." icon="contact_support" />
            <div className="flex flex-wrap gap-3">
              <Button>Open support request</Button>
              <Button variant="secondary">View policy handbook</Button>
            </div>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  )
}
