import { createFileRoute } from '@tanstack/react-router'
import { buildX402PaymentRequiredResponse, getX402ServiceConfig } from '~/lib/agent-service'
import type { DemoEvaluationRequest } from '~/lib/api'
import { evaluateDemoRequest, parseDemoEvaluationRequest } from '~/lib/evaluator'
import { savePersistedEvaluation } from '~/lib/evaluation-store.server'

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
                error: 'x402 payment verification is not fully configured yet. Set AEGIS_X402_DEMO_BYPASS=true for local demo-only service calls.',
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
          await savePersistedEvaluation({
            createdAt: evaluation.createdAt,
            request: rawBody as DemoEvaluationRequest,
            response: evaluation.response,
          })

          return Response.json(evaluation.response, {
            headers: {
              'Cache-Control': 'no-store',
              'X-Aegis-Service-Network': x402.network,
              'X-Aegis-Service-Mode': x402.enabled
                ? x402.demoBypass
                  ? 'x402-demo-bypass'
                  : 'x402-payment-required'
                : 'open-demo',
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
