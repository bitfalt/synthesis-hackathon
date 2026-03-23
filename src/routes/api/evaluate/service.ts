import { createFileRoute } from '@tanstack/react-router'
import { buildX402PaymentRequiredResponse, getX402ServiceConfig } from '~/lib/agent-service'
import type { DemoEvaluationRequest } from '~/lib/api'
import { evaluateDemoRequest, parseDemoEvaluationRequest } from '~/lib/evaluator'
import { savePersistedEvaluation } from '~/lib/evaluation-store.server'
import { getOperatorSessionFromRequest } from '~/lib/operator-store'

export const Route = createFileRoute('/api/evaluate/service')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const rawBody = await request.json()
          const body = parseDemoEvaluationRequest(rawBody)
          const x402 = getX402ServiceConfig()
          const paymentHeader = request.headers.get('x-payment')

          if (x402.enabled && !paymentHeader) {
            return Response.json(buildX402PaymentRequiredResponse(), {
              status: 402,
              headers: {
                'Cache-Control': 'no-store',
              },
            })
          }

          if (x402.enabled && paymentHeader && !x402.demoBypass) {
            return Response.json(
              {
                error: 'x402 payment verification is not fully configured yet. Use AEGIS_X402_MODE=demo-bypass for demo-only paid service calls.',
              },
              {
                status: 501,
                headers: {
                  'Cache-Control': 'no-store',
                },
              },
            )
          }

          const evaluation = await evaluateDemoRequest(body)
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
            createdAt: storedEvaluation.createdAt,
            receipt: storedEvaluation.receipt,
            privateAccessToken: storedEvaluation.privateAccessToken,
          }, {
            headers: {
              'Cache-Control': 'no-store',
              'X-Aegis-Service-Network': x402.network,
              'X-Aegis-Service-Mode': x402.mode,
            },
          })
        } catch (error) {
          const message = error instanceof Error
            ? error.message
            : 'The treasury evaluation service could not process this request.'

          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
