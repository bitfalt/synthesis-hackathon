import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { buildX402PaymentRequiredResponse, getX402ServiceConfig } from '~/lib/agent-service'
import { evaluateDemoRequest } from './demo'

const requestSchema = z.object({
  treasuryPolicy: z.string().trim().min(1).max(8000),
  treasuryState: z.string().trim().min(1).max(8000),
  proposedAction: z.string().trim().min(1).max(4000),
})

export const Route = createFileRoute('/api/evaluate/service')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = requestSchema.parse(await request.json())
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

          return Response.json(evaluation, {
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
          const message = error instanceof z.ZodError
            ? 'Treasury policy, treasury state, and proposed action are all required.'
            : 'The treasury evaluation service could not process this request.'

          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
