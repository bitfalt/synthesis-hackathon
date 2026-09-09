import { createFileRoute } from '@tanstack/react-router'
import { buildReceiptArtifact } from '~/lib/agent-service'
import { getPersistedEvaluationByReceiptId } from '~/lib/evaluation-store.server'

export const Route = createFileRoute('/api/receipts/$receiptId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const evaluation = await getPersistedEvaluationByReceiptId(params.receiptId)

        if (!evaluation) {
          return Response.json({ error: 'Receipt artifact not found.' }, { status: 404 })
        }

        return Response.json(buildReceiptArtifact(evaluation), {
          headers: {
            'Cache-Control': 'no-store',
          },
        })
      },
    },
  },
})
