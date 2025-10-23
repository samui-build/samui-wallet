import { ShellFeature } from '@workspace/shell/shell-feature'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ShellFeature />
  </StrictMode>,
)
