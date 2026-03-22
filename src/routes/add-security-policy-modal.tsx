import { createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { ConsoleLayout } from '~/components/layout/console-layout'
import { PolicyManagementContent } from '~/components/pages/policy-management-content'

export const Route = createFileRoute('/add-security-policy-modal')({
  component: AddSecurityPolicyModalPage,
})

function AddSecurityPolicyModalPage() {
  return (
    <ConsoleLayout
      eyebrow="Modal state"
      title="Add security policy"
      description="The Stitch modal has been promoted into a real route so it can be reviewed, tested, and refined inside the TanStack app."
      contentClassName="max-w-[1380px]"
      topbarActions={<Button className="px-5 py-2 text-[0.65rem]">Connect Wallet</Button>}
    >
      <PolicyManagementContent showModal />
    </ConsoleLayout>
  )
}
