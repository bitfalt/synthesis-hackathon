import { createFileRoute } from '@tanstack/react-router'
import {
  clearOperatorSessionCookie,
  destroyOperatorSession,
} from '~/lib/operator-store'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        destroyOperatorSession(request)

        return Response.json(
          { ok: true },
          {
            headers: {
              'Cache-Control': 'no-store',
              'Set-Cookie': clearOperatorSessionCookie(request),
            },
          },
        )
      },
    },
  },
})
