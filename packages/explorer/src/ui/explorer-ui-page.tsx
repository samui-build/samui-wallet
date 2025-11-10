import { UiContainer } from '@workspace/ui/components/ui-container'
import type { ReactNode } from 'react'

export function ExplorerUiPage({ children }: { children: ReactNode }) {
  return <UiContainer>{children}</UiContainer>
}
