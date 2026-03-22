import { createFileRoute } from '@tanstack/react-router'
import { getAgentLogArtifact } from '~/lib/agent-service'

export const Route = createFileRoute('/api/agent-logs/$receiptId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const artifact = getAgentLogArtifact(params.receiptId)

        if (!artifact) {
          return Response.json({ error: 'Agent log artifact not found.' }, { status: 404 })
        }

        return Response.json(artifact, {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
