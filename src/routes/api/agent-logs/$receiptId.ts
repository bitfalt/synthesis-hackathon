import { createFileRoute } from '@tanstack/react-router'
import { buildAgentLogArtifact } from '~/lib/agent-service'
import { getPersistedEvaluationByReceiptId } from '~/lib/evaluation-store.server'

export const Route = createFileRoute('/api/agent-logs/$receiptId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const evaluation = await getPersistedEvaluationByReceiptId(params.receiptId)

        if (!evaluation) {
          return Response.json({ error: 'Agent log artifact not found.' }, { status: 404 })
        }

        return Response.json(buildAgentLogArtifact(evaluation), {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
