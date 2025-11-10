import { UiContainer } from '@workspace/ui/components/ui-container'
import type { ReactNode } from 'react'

export function ExplorerUiPage({ children }: { children: ReactNode }) {
  return <UiContainer className="py-2 sm:py-4 md:py-6 lg:py-8">{children}</UiContainer>
}
