import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { lazy } from 'react'

const ToolsFeatureOverview = lazy(() => import('./tools-feature-overview.js'))

export default function ToolsRoutes() {
  return (
    <UiTabRoutes
      basePath="/tools"
      className="mt-2 mb-4 lg:mb-6"
      tabs={[
        // More routes here
        { element: <ToolsFeatureOverview />, label: 'Overview', path: 'overview' },
      ]}
    />
  )
}
