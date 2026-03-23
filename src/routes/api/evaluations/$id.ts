import { createFileRoute } from '@tanstack/react-router'
import { getPersistedEvaluation } from '~/lib/evaluation-store.server'

export const Route = createFileRoute('/api/evaluations/$id')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const evaluation = await getPersistedEvaluation(params.id)

        if (!evaluation) {
          return Response.json({ error: 'Evaluation not found.' }, { status: 404 })
        }

        return Response.json({ evaluation }, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
