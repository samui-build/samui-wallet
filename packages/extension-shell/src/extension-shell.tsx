import { ExtensionPageOptions } from './extension-page-options'
import { ExtensionPagePopup } from './extension-page-popup'
import { ExtensionPageSidePanel } from './extension-page-side-panel'

export enum ExtensionPage {
  Options = 'Options',
  Popup = 'Popup',
  SidePanel = 'SidePanel',
}

export function ExtensionShell({ page }: { page: ExtensionPage }) {
  switch (page) {
    case ExtensionPage.Options:
      return <ExtensionPageOptions />
    case ExtensionPage.Popup:
      return <ExtensionPagePopup />
    case ExtensionPage.SidePanel:
      return <ExtensionPageSidePanel />
    default:
      throw new Error(`Unknown page: ${page}`)
  }
}
