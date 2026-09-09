import { createFileRoute } from '@tanstack/react-router'
import { getOperatorSessionFromRequest } from '~/lib/operator-store'

export const Route = createFileRoute('/api/auth/session')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return Response.json(
          {
            session: getOperatorSessionFromRequest(request),
          },
          {
            headers: {
              'Cache-Control': 'no-store',
            },
          },
        )
      },
    },
  },
})
