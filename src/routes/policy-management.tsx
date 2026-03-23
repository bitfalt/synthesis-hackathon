import { createFileRoute } from '@tanstack/react-router'
import { Badge } from '~/components/ui/badge'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { PolicyManagementContent } from '~/components/pages/policy-management-content'

export const Route = createFileRoute('/policy-management')({
  component: PolicyManagementPage,
})

function PolicyManagementPage() {
  return (
    <ConsoleLayout
      eyebrow="Rule registry"
      title="Policy management"
      description="Supporting surface for the MVP. Structured policy CRUD is live here, but judges can understand the core product without using this route in the first pass."
      contentClassName="max-w-[1380px]"
      topbarActions={
        <>
          <Badge tone="info">Supporting surface</Badge>
          <Badge tone="primary">Real policy CRUD</Badge>
        </>
      }
    >
      <PolicyManagementContent />
    </ConsoleLayout>
  )
}
