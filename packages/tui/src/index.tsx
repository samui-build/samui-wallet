import { createCliRenderer } from '@opentui/core'
import { createRoot } from '@opentui/react'
import { App } from './components/app.tsx'

export async function start() {
  const renderer = await createCliRenderer()
  createRoot(renderer).render(<App />)
}
