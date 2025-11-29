import { createRoot } from 'react-dom/client'
import '@workspace/ui/globals.css'

import { setEntrypoint } from '@workspace/background/entrypoint'
import { ShellProviders } from '@workspace/shell/data-access/shell-providers'
import { StrictMode } from 'react'
import { Request } from '../../components/request.tsx'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

setEntrypoint('request')

createRoot(root).render(
  <StrictMode>
    <ShellProviders>
      <Request />
    </ShellProviders>
  </StrictMode>,
)
