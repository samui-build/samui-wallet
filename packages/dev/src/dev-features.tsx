import type { UiTabRoute } from '@workspace/ui/components/ui-tab-routes'

import { lazy } from 'react'

const DevFeatureError = lazy(() => import('./dev-feature-error.tsx'))
const DevFeatureScratchPad = lazy(() => import('./dev-feature-scratch-pad.tsx'))
const DevFeatureSolana = lazy(() => import('./dev-feature-solana.tsx'))
const DevFeatureUi = lazy(() => import('./dev-feature-ui.tsx'))

export const devFeatures: UiTabRoute[] = [
  { element: <DevFeatureScratchPad />, label: 'Scratch Pad', path: 'scratch-pad' },
  { element: <DevFeatureError />, label: 'Error', path: 'error' },
  { element: <DevFeatureSolana />, label: 'Solana', path: 'solana' },
  { element: <DevFeatureUi />, label: 'UI', path: 'ui' },
]

export function getDevOptions(): { label: string; path: string }[] {
  return devFeatures.map(({ label, path }) => ({ label: label.toString(), path: `/dev/${path}` }))
}
