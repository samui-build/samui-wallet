import { UiPage } from '@workspace/ui/components/ui-page'
import { ExplorerUiError } from './explorer-ui-error.tsx'

export function ExplorerUiErrorPage({ message, title }: { message: string; title: string }) {
  return (
    <UiPage>
      <ExplorerUiError message={message} title={title} />
    </UiPage>
  )
}
