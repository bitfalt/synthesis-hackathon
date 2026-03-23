import { createFileRoute } from '@tanstack/react-router'
import { getOperatorSessionFromRequest } from '~/lib/operator-store'
import { activatePolicySet } from '~/lib/server/policy-store'

export const Route = createFileRoute('/api/policies/$policyId/activate')({
  server: {
    handlers: {
      POST: async ({ params, request }) => {
        const session = getOperatorSessionFromRequest(request)

        if (!session) {
          return Response.json({ error: 'Sign in as an operator to activate policy sets.' }, { status: 401 })
        }

        const policy = await activatePolicySet(params.policyId, session.address)

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
