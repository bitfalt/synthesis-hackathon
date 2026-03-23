import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { policySetWriteSchema } from '~/lib/policies'
import { getPolicySet, updatePolicySet } from '~/lib/server/policy-store'

export const Route = createFileRoute('/api/policies/$policyId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const policy = await getPolicySet(params.policyId)

        if (!policy) {
          return Response.json({ error: 'Policy set not found.' }, { status: 404 })
        }

        return Response.json(policy, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
      PATCH: async ({ params, request }) => {
        try {
          const body = policySetWriteSchema.parse(await request.json())
          const policy = await updatePolicySet(params.policyId, {
            ...body,
            updatedByAddress: body.updatedByAddress ?? null,
          })

          if (!policy) {
            return Response.json({ error: 'Policy set not found.' }, { status: 404 })
          }

          return Response.json(policy, {
            headers: {
              'Cache-Control': 'no-store',
            },
          })
        } catch (error) {
          const message = error instanceof z.ZodError
            ? 'Structured policy name, description, and rule values are required.'
            : error instanceof Error
              ? error.message
              : 'The policy set could not be updated.'

          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
