import { createFileRoute } from '@tanstack/react-router'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { SectionHeading } from '~/components/layout/section-heading'
import { Panel } from '~/components/ui/panel'
import { Badge } from '~/components/ui/badge'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <ConsoleLayout
      eyebrow="Console configuration"
      title="Settings"
      description="Control privacy posture, receipt defaults, and service-level behavior without leaving the Aegis shell."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Panel>
          <SectionHeading title="Policy and privacy settings" description="Critical defaults that affect every treasury evaluation." icon="settings" />
          <div className="space-y-4">
            {[
              ['Default privacy mode', 'Private rationale + public-safe summary'],
              ['Receipt strictness', 'Mandatory for strategic actions'],
              ['Escalation policy', 'Manual signer review at threshold breach'],
            ].map(([label, value]) => (
              <div key={label} className="detail-row">
                <span>{label}</span>
                <span className="font-semibold text-aegis-text">{value}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel tone="glass">
          <SectionHeading title="Runtime status" description="High-level operational posture for the current operator environment." icon="monitoring" />
          <div className="space-y-4">
            <div className="rounded-3xl bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-aegis-text">Venice reasoning lane</p>
                <Badge tone="primary">Healthy</Badge>
              </div>
            </div>
            <div className="rounded-3xl bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-aegis-text">ERC-8004 receipt mode</p>
                <Badge tone="info">Configured</Badge>
              </div>
            </div>
            <div className="rounded-3xl bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-aegis-text">Base service layer</p>
                <Badge tone="warning">Demo-mode</Badge>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  )
}
