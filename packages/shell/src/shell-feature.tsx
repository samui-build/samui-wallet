import { ShellProviders } from './data-access/shell-providers.tsx'
import { ShellRoutes } from './shell-routes.tsx'
import '@workspace/ui/globals.css'
import type { WxtBrowser } from 'wxt/browser'

export type ShellContext = 'Desktop' | 'Onboarding' | 'Popup' | 'Sidebar' | 'Web'
export interface ShellFeatureProps {
  browser?: WxtBrowser | undefined
  context: ShellContext
}

export function ShellFeature({ browser, context }: ShellFeatureProps) {
  return (
    <ShellProviders>
      <ShellRoutes browser={browser} context={context} />
    </ShellProviders>
  )
}
