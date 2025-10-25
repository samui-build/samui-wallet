import { Hono } from 'hono'
import { cors } from 'hono/cors'
import * as process from 'node:process'

const app = new Hono()

app.use(
  cors({
    origin: '*',
  }),
)

app.get('/', (c) => {
  return c.text('Samui Wallet')
})

app.get('/healthz', (c) => {
  return c.json({
    arch: process.arch,
    platform: process.platform,
    title: process.title,
    uptime: process.uptime(),
    version: process.version,
  })
})

export default app
