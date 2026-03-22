import { createFileRoute } from '@tanstack/react-router'
import { getReceiptArtifact } from '~/lib/agent-service'

export const Route = createFileRoute('/api/receipts/$receiptId')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const artifact = getReceiptArtifact(params.receiptId)

        if (!artifact) {
          return Response.json({ error: 'Receipt artifact not found.' }, { status: 404 })
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
