import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono<{ Bindings: Cloudflare.Env }>()

app.use('*', async (c, next) => {
  const origin = c.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()) ?? []

  const handler = cors({ origin })
  return handler(c, next)
})

app.get('/', (c) => {
  return c.text('Samui Wallet')
})

export default app
