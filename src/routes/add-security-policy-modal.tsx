import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { PolicyManagementContent } from '~/components/pages/policy-management-content'

export const Route = createFileRoute('/add-security-policy-modal')({
  component: AddSecurityPolicyModalPage,
})

function AddSecurityPolicyModalPage() {
  return (
    <ConsoleLayout
      eyebrow="Modal state"
      title="Create policy set"
      description="Open the structured policy set form directly in modal mode, then return to the main policy workspace once the draft is saved."
      contentClassName="max-w-[1380px]"
      topbarActions={<Badge tone="info">Supporting surface</Badge>}
    >
      <PolicyManagementContent showModal />
    </ConsoleLayout>
  )
}
