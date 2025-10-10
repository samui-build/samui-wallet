import { CoreFeature } from '@workspace/features/core/core-feature.tsx'
import { StrictMode } from 'react'
import '@workspace/ui/globals.css'
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CoreFeature />
  </StrictMode>,
)
