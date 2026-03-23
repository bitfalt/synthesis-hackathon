import { createFileRoute } from '@tanstack/react-router'
import { activatePolicySet } from '~/lib/server/policy-store'

export const Route = createFileRoute('/api/policies/$policyId/activate')({
  server: {
    handlers: {
      POST: async ({ params }) => {
        const policy = await activatePolicySet(params.policyId, null)

        if (!policy) {
          return Response.json({ error: 'Policy set not found.' }, { status: 404 })
        }

        return Response.json(policy, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
