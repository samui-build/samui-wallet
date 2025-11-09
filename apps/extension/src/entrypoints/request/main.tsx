import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import '@workspace/ui/globals.css'

import { StrictMode } from 'react'
import { RequestFeature } from '@/features/request/request-feature.tsx'
import { ExtensionProviders } from '@/features/shell/extension-providers.tsx'

const queryClient = new QueryClient()

const root = document.getElementById('root')
if (!root) {
  throw new Error('Root element not found')
}

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ExtensionProviders>
        <RequestFeature />
      </ExtensionProviders>
    </QueryClientProvider>
  </StrictMode>,
)
