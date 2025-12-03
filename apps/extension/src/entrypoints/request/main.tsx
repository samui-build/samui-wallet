import { createRoot } from 'react-dom/client'
import '@workspace/ui/globals.css'

import { setEntrypoint } from '@workspace/background/entrypoint'
import { ShellFeature } from '@workspace/shell/shell-feature'
import { StrictMode } from 'react'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

setEntrypoint('request')

createRoot(root).render(
  <StrictMode>
    <ShellFeature />
  </StrictMode>,
)
