import { createFileRoute } from '@tanstack/react-router'
import { isAddress, verifyMessage } from 'viem'
import { z } from 'zod'
import {
  createOperatorSession,
  createOperatorSessionCookie,
  takeChallenge,
} from '~/lib/operator-store'

const verifySchema = z.object({
  address: z.string().trim().min(1),
  signature: z.string().trim().min(1),
  nonce: z.string().trim().min(1),
})

export const Route = createFileRoute('/api/auth/verify')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = verifySchema.parse(await request.json())

          if (!isAddress(body.address)) {
            return Response.json({ error: 'A valid wallet address is required.' }, { status: 400 })
          }

          const challenge = takeChallenge(body.address, body.nonce)

          if (!challenge) {
            return Response.json({ error: 'That operator challenge is missing or expired.' }, { status: 400 })
          }

          const isValid = await verifyMessage({
            address: challenge.address as `0x${string}`,
            message: challenge.message,
            signature: body.signature as `0x${string}`,
          })

          if (!isValid) {
            return Response.json({ error: 'The wallet signature could not be verified.' }, { status: 401 })
          }

          const session = createOperatorSession(challenge.address)
          return Response.json(
            { session },
            {
              headers: {
                'Cache-Control': 'no-store',
                'Set-Cookie': createOperatorSessionCookie(request, session.id),
              },
            },
          )
        } catch {
          return Response.json({ error: 'Unable to verify the operator signature.' }, { status: 400 })
        }
      },
    },
  },
})
