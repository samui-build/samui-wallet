import { ShellProviders } from './data-access/shell-providers.tsx'
import { ShellRoutes } from './shell-routes.tsx'
import '@workspace/ui/globals.css'
import type { WxtBrowser } from 'wxt/browser'

export type ShellContext = 'Desktop' | 'Onboarding' | 'Popup' | 'Sidebar' | 'Web'
export interface ShellFeatureProps {
  browser?: WxtBrowser | undefined
  context: ShellContext
  // TODO: Remove children when we have handled bundle splitting and tree shaking between web and extension
  children?: React.ReactNode
}

export function ShellFeature({ browser, context, children }: ShellFeatureProps) {
  return (
    <ShellProviders>
      {children}
      <ShellRoutes browser={browser} context={context} />
    </ShellProviders>
  )
}
