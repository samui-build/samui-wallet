import '@workspace/ui/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ExtensionProviders } from '@/features/shell/extension-providers.tsx'
import { ExtensionShell } from '@/features/shell/extension-shell.tsx'

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <ExtensionProviders>
      <ExtensionShell mode="Sidebar" />
    </ExtensionProviders>
  </StrictMode>,
)
