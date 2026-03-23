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
      description="Live supporting capability for the MVP. Structured policy CRUD is real and drives the evaluator, but judges can still understand the core product by following the dashboard -> result -> history loop first."
      contentClassName="max-w-[1380px]"
      topbarActions={
        <>
          <Badge tone="info">Live supporting surface</Badge>
          <Badge tone="primary">Evaluator-backed policy CRUD</Badge>
        </>
      }
    >
      <PolicyManagementContent />
    </ConsoleLayout>
  )
}
