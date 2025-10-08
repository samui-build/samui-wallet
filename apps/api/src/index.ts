import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Samui Wallet')
})

export default app
