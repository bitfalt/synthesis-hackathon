import { createFileRoute } from '@tanstack/react-router'
import { listPersistedEvaluations } from '~/lib/evaluation-store.server'

export const Route = createFileRoute('/api/evaluations')({
  server: {
    handlers: {
      GET: async () => {
        const evaluations = await listPersistedEvaluations()

        return Response.json({ evaluations }, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
