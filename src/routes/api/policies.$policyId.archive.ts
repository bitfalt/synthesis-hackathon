import { createFileRoute } from '@tanstack/react-router'
import { archivePolicySet } from '~/lib/server/policy-store'

export const Route = createFileRoute('/api/policies/$policyId/archive')({
  server: {
    handlers: {
      POST: async ({ params }) => {
        try {
          const policy = await archivePolicySet(params.policyId, null)

          if (!policy) {
            return Response.json({ error: 'Policy set not found.' }, { status: 404 })
          }

          return Response.json(policy, {
            headers: {
              'Cache-Control': 'no-store',
            },
          })
        } catch (error) {
          const message = error instanceof Error ? error.message : 'The policy set could not be archived.'
          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
