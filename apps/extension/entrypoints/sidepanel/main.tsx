import { ExtensionProviders } from '@workspace/extension-shell/extension-providers'
import { ExtensionPage, ExtensionShell } from '@workspace/extension-shell/extension-shell'
import React from 'react'
import '@workspace/ui/globals.css'
import ReactDOM from 'react-dom/client'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ExtensionProviders>
      <ExtensionShell page={ExtensionPage.SidePanel} />
    </ExtensionProviders>
  </React.StrictMode>,
)
