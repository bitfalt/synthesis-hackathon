import { createFileRoute } from '@tanstack/react-router'
import type { DemoEvaluationRequest } from '~/lib/api'
import { savePersistedEvaluation } from '~/lib/evaluation-store.server'
import { evaluateDemoRequest, parseDemoEvaluationRequest } from '~/lib/evaluator'

export const Route = createFileRoute('/api/evaluate/demo')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.json()
          const parsedRequest = parseDemoEvaluationRequest(rawBody)
          const evaluation = await evaluateDemoRequest(parsedRequest)

          await savePersistedEvaluation({
            createdAt: evaluation.createdAt,
            request: rawBody as DemoEvaluationRequest,
            response: evaluation.response,
          })

          return Response.json(evaluation.response, {
            headers: {
              'Cache-Control': 'no-store',
            },
          })
        } catch (error) {
          const message = error instanceof Error
            ? error.message
            : 'The demo evaluator could not process this request.'

          return Response.json(
            { error: message },
            {
              status: 400,
              headers: {
                'Cache-Control': 'no-store',
              },
            },
          )
        }
      },
    },
  },
})
