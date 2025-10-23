import { ShellProviders } from './data-access/shell-providers.js'
import { ShellRoutes } from './shell-routes.js'
import '@workspace/ui/globals.css'

export function ShellFeature() {
  return (
    <ShellProviders>
      <ShellRoutes />
    </ShellProviders>
  )
}
