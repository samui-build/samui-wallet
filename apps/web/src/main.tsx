import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@samui-wallet/ui/globals.css'
import { CoreFeature } from '@samui-wallet/features/core/core-feature.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoreFeature />
  </StrictMode>,
)
