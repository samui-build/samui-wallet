import { ShellProviders } from './data-access/shell-providers.tsx'
import { ShellRoutes } from './shell-routes.tsx'
import '@workspace/ui/globals.css'

export function ShellFeature() {
  return (
    <ShellProviders>
      <ShellRoutes />
    </ShellProviders>
  )
}
