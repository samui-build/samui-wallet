import { ShellFeature } from '@workspace/shell/shell-feature'
import { ExtensionLayout } from '@/features/shell/extension-layout.tsx'

export type ExtensionShellMode = 'Popup' | 'Sidebar'

export function ExtensionShell({ mode }: { mode: ExtensionShellMode }) {
  return (
    <ExtensionLayout mode={mode}>
      <ShellFeature />
    </ExtensionLayout>
  )
}
