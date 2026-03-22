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
                <Badge tone="warning">Optional env</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-aegis-text-muted">
                Live Venice reasoning uses `VENICE_API_KEY` and defaults to `qwen3-5-9b` unless `VENICE_MODEL` is overridden. Without credentials, the MVP uses deterministic fallback wording.
              </p>
            </div>
            <div className="rounded-3xl bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-aegis-text">ERC-8004 receipt mode</p>
                <Badge tone="info">Hosted demo</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-aegis-text-muted">
                The current build publishes `/.well-known/agent.json` and hosted JSON receipt/log endpoints, but the artifacts are still unsigned demo surfaces.
              </p>
            </div>
            <div className="rounded-3xl bg-black/15 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-aegis-text">Base service layer</p>
                <Badge tone="info">Discovery live</Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-aegis-text-muted">
                The service exposes Base-aware discovery at `/api/x402/discovery`, `/.well-known/x402`, and a callable `/api/evaluate/service` endpoint. Live x402 settlement still needs facilitator verification beyond the current challenge surface.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </ConsoleLayout>
  )
}
