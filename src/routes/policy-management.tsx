import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
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
      description="Curate the bounded treasury guardrails that shape every evaluation. The goal is a compact, reviewable policy stack rather than an overbuilt rule engine."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <PolicyManagementContent />
    </ConsoleLayout>
  )
}
