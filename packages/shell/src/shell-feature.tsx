import { ShellProviders } from './data-access/shell-providers.tsx'
import { ShellRoutes } from './shell-routes.tsx'
import '@workspace/ui/globals.css'

export type ShellContext = 'Desktop' | 'Onboarding' | 'Popup' | 'Sidebar' | 'Web'

export function ShellFeature({ context }: { context: ShellContext }) {
  return (
    <ShellProviders>
      <ShellRoutes context={context} />
    </ShellProviders>
  )
}
