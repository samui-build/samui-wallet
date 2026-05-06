import { getEntrypoint } from '@workspace/env/get-entrypoint'
import { ShellUiMenuActionsPopup } from './shell-ui-menu-actions-popup.tsx'
import { ShellUiMenuActionsSidebar } from './shell-ui-menu-actions-sidebar.tsx'

export function ShellUiMenuActions() {
  switch (getEntrypoint()) {
    case 'popup':
      return <ShellUiMenuActionsPopup />
    case 'sidepanel':
      return <ShellUiMenuActionsSidebar />
    default:
      return null
  }
}
