import { createFileRoute } from '@tanstack/react-router'
import { isAddress } from 'viem'
import { z } from 'zod'
import { createChallenge } from '~/lib/operator-store'

const challengeSchema = z.object({
  address: z.string().trim().min(1),
})

export const Route = createFileRoute('/api/auth/challenge')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = challengeSchema.parse(await request.json())

          if (!isAddress(body.address)) {
            return Response.json({ error: 'A valid wallet address is required.' }, { status: 400 })
          }

          const challenge = createChallenge(body.address)
          return Response.json(challenge, {
            headers: {
              'Cache-Control': 'no-store',
            },
          })
        } catch {
          return Response.json({ error: 'Unable to create an operator challenge.' }, { status: 400 })
        }
      },
    },
  },
})
