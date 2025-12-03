import { setEntrypoint } from '@workspace/background/entrypoint'
import { ShellFeature } from '@workspace/shell/shell-feature'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

setEntrypoint('sidepanel')

// TODO: Extension not secure until https://github.com/samui-build/samui-wallet/issues/161 is resolved
// Use at your own risk
createRoot(root).render(
  <StrictMode>
    <ShellFeature />
  </StrictMode>,
)
