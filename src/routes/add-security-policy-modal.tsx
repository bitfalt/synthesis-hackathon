import { createFileRoute } from '@tanstack/react-router'
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
    >
      <PolicyManagementContent showModal />
    </ConsoleLayout>
  )
}
