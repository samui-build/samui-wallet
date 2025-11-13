import { UiPage } from '@workspace/ui/components/ui-page'
import type { ReactNode } from 'react'

export function ExplorerUiPage({ children }: { children: ReactNode }) {
  return <UiPage>{children}</UiPage>
}
