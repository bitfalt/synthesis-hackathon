import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Panel } from '~/components/ui/panel'
import { supportServices } from '~/content/aegis'
import { FieldLabel, SelectInput, TextArea, TextInput } from '~/components/ui/field'
import { Button } from '~/components/ui/button'
import { Icon } from '~/components/ui/icon'

export const Route = createFileRoute('/request-service')({
  component: RequestServicePage,
})

function RequestServicePage() {
  return (
    <ConsoleLayout
      eyebrow="Concierge workflow"
      title="Request enterprise strategic services"
      description="Secure high-touch support from the sovereign desk. This route mirrors the Stitch request flow while fitting the composable TanStack app shell."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Panel>
            <SectionHeading
              title="1. Service protocol"
              description="Pick the engagement type that best matches the treasury problem you want reviewed."
              icon="analytics"
            />
            <div className="grid gap-4 md:grid-cols-2">
              {supportServices.map((service, index) => (
                <article key={service.name} className={`rounded-3xl p-5 ${index === 0 ? 'bg-aegis-primary/10 ghost-outline' : 'bg-aegis-highest/60'}`}>
                  <Icon name={service.icon} className={`text-3xl ${index === 0 ? 'text-aegis-primary' : 'text-aegis-text-muted'}`} />
                  <h3 className="mt-4 text-lg font-semibold text-aegis-text">{service.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-aegis-text-muted">{service.description}</p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel tone="glass">
            <SectionHeading
              title="2. Engagement parameters"
              description="Capture the core sizing, urgency, and private context needed for the service request."
              icon="tune"
            />
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel>Treasury size (USD)</FieldLabel>
                <SelectInput className="mt-2">
                  <option>$1M – $10M</option>
                  <option>$10M – $50M</option>
                  <option>$50M – $250M</option>
                  <option>$250M+</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Urgency level</FieldLabel>
                <SelectInput className="mt-2">
                  <option>Standard (5–7 business days)</option>
                  <option>Priority (48–72 hours)</option>
                  <option>Critical / immediate</option>
                </SelectInput>
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Context owner</FieldLabel>
                <TextInput className="mt-2" defaultValue="Treasury Council / Strategy Ops" />
              </div>
              <div className="md:col-span-2">
                <FieldLabel>Private request brief</FieldLabel>
                <TextArea
                  className="mt-2"
                  defaultValue="We need a private review of a strategic liquidity allocation before circulating a public summary to the broader governance group."
                />
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button>Submit request</Button>
              <Button variant="secondary">Save concierge draft</Button>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <SectionHeading
              title="Support posture"
              description="What the request unlocks once it reaches the desk."
              icon="verified"
            />
            <div className="detail-list">
              <div className="detail-row"><span>Private analysis lane</span><span>Enabled</span></div>
              <div className="detail-row"><span>Receipt requirement</span><span>Mandatory for strategic actions</span></div>
              <div className="detail-row"><span>Response mode</span><span>Private rationale + public-safe summary</span></div>
            </div>
          </Panel>

          <Panel tone="glass">
            <SectionHeading
              title="Expected response package"
              description="The service output should always remain bounded and reviewable."
              icon="inventory_2"
            />
            <ul className="space-y-3 text-sm leading-6 text-aegis-text-muted">
              <li>• A recommendation class (ALLOW / WARN / BLOCK)</li>
              <li>• A concise confidence band</li>
              <li>• Private rationale for internal operators</li>
              <li>• A public-safe explanation for broader circulation</li>
              <li>• A structured receipt for trust and auditability</li>
            </ul>
          </Panel>
        </div>
      </div>
    </ConsoleLayout>
  )
}
