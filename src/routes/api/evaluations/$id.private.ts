import { createFileRoute } from '@tanstack/react-router'
import {
  getPersistedEvaluation,
  hasPrivateEvaluationAccess,
  toPrivateEvaluationDetails,
} from '~/lib/evaluation-store.server'

export const Route = createFileRoute('/api/evaluations/$id/private')({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const evaluation = await getPersistedEvaluation(params.id)

        if (!evaluation) {
          return Response.json({ error: 'Evaluation not found.' }, { status: 404 })
        }

        const accessToken = request.headers.get('X-Aegis-Private-Access')

        if (!hasPrivateEvaluationAccess(evaluation, accessToken)) {
          return Response.json(
            {
              error: 'Private evaluation detail is only available to the browser session that created this run.',
            },
            {
              status: 403,
              headers: {
                'Cache-Control': 'no-store',
              },
            },
          )
        }

        return Response.json(
          { evaluation: toPrivateEvaluationDetails(evaluation) },
          {
            headers: {
              'Cache-Control': 'no-store',
            },
          },
        )
      },
    },
  },
})
