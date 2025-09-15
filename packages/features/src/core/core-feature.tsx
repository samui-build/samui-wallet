import { HashRouter } from 'react-router'
import { CoreRoutes } from './core-routes.js'
import { CoreProviders } from './data-access/core-providers.js'

export function CoreFeature() {
  return (
    <CoreProviders>
      <HashRouter>
        <CoreRoutes />
      </HashRouter>
    </CoreProviders>
  )
}
