import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@workspace/ui/globals.css'
import { CoreFeature } from '@workspace/features/core/core-feature.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoreFeature />
  </StrictMode>,
)
