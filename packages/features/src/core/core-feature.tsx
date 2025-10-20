import { CoreRoutes } from './core-routes.js'
import { CoreProviders } from './data-access/core-providers.js'

export function CoreFeature() {
  return (
    <CoreProviders>
      <CoreRoutes />
    </CoreProviders>
  )
}
