import { createFileRoute } from '@tanstack/react-router'
import { getX402DiscoveryDocument } from '~/lib/agent-service'

export const Route = createFileRoute('/api/x402/discovery')({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(getX402DiscoveryDocument(), {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
