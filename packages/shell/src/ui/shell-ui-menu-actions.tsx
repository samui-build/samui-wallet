import type { ShellFeatureProps } from '../shell-feature.tsx'
import { ShellUiMenuActionsPopup } from './shell-ui-menu-actions-popup.tsx'
import { ShellUiMenuActionsSidebar } from './shell-ui-menu-actions-sidebar.tsx'

export function ShellUiMenuActions({ browser, context }: ShellFeatureProps) {
  switch (context) {
    case 'Popup':
      return <ShellUiMenuActionsPopup browser={browser} />
    case 'Sidebar':
      return <ShellUiMenuActionsSidebar />
    default:
      return null
  }
}
