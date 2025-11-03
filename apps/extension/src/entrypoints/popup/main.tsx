import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import '@workspace/ui/globals.css'

import { StrictMode } from 'react'
import { App } from './app.tsx'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
