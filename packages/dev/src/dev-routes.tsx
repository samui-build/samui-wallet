import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { lazy } from 'react'

const DevFeatureDb = lazy(() => import('./dev-feature-db.js'))
const DevFeatureSolana = lazy(() => import('./dev-feature-solana.js'))
const DevFeatureUi = lazy(() => import('./dev-feature-ui.js'))

export default function DevRoutes() {
  return (
    <UiTabRoutes
      basePath="/dev"
      className="mt-2 mb-4 lg:mb-6"
      tabs={[
        { element: <DevFeatureDb />, label: 'DB', path: 'db' },
        { element: <DevFeatureSolana />, label: 'Solana', path: 'solana' },
        { element: <DevFeatureUi />, label: 'UI', path: 'ui' },
      ]}
    />
  )
}
