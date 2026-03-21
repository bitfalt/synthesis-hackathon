import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { evaluateRoute } from './routes/evaluate'

const app = new Hono()

app.get('/api/health', (c) => c.json({ ok: true }))
app.route('/api', evaluateRoute)

serve({ fetch: app.fetch, port: 8787 })
