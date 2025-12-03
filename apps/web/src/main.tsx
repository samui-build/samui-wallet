import '@workspace/i18n'
import { ShellFeature } from '@workspace/shell/shell-feature'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <ShellFeature />
  </StrictMode>,
)
