import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { getOperatorSessionFromRequest } from '~/lib/operator-store'
import { policySetWriteSchema } from '~/lib/policies'
import { createPolicySet, listPolicySets } from '~/lib/server/policy-store'

export const Route = createFileRoute('/api/policies')({
  server: {
    handlers: {
      GET: async () => {
        const policies = await listPolicySets()

        return Response.json(policies, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
      POST: async ({ request }) => {
        const session = getOperatorSessionFromRequest(request)

        if (!session) {
          return Response.json({ error: 'Sign in as an operator to create policy sets.' }, { status: 401 })
        }

        try {
          const body = policySetWriteSchema.parse(await request.json())
          const policy = await createPolicySet({
            ...body,
            createdByAddress: session.address,
            updatedByAddress: session.address,
          })

          return Response.json(policy, {
            status: 201,
            headers: {
              'Cache-Control': 'no-store',
            },
          })
        } catch (error) {
          const message = error instanceof z.ZodError
            ? 'Structured policy name, description, and rule values are required.'
            : 'The policy set could not be created.'

          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
