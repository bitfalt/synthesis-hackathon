import { createFileRoute } from '@tanstack/react-router'
import type { DemoEvaluationRequest } from '~/lib/api'
import { savePersistedEvaluation } from '~/lib/evaluation-store.server'
import { evaluateDemoRequest, parseDemoEvaluationRequest } from '~/lib/evaluator'
import { getOperatorSessionFromRequest } from '~/lib/operator-store'

export const Route = createFileRoute('/api/evaluate/demo')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.json()
          const parsedRequest = parseDemoEvaluationRequest(rawBody)
          const evaluation = await evaluateDemoRequest(parsedRequest)
          const session = getOperatorSessionFromRequest(request)

          const storedEvaluation = await savePersistedEvaluation({
            createdAt: evaluation.createdAt,
            request: rawBody as DemoEvaluationRequest,
            response: evaluation.response,
            submittedByAddress: session?.address ?? null,
            submittedByLabel: session?.display ?? null,
          })

          return Response.json({
            ...evaluation.response,
            receipt: storedEvaluation.receipt,
            privateAccessToken: storedEvaluation.privateAccessToken,
          }, {
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
