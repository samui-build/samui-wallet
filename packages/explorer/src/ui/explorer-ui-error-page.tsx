import { UiError } from '@workspace/ui/components/ui-error'
import { ExplorerUiPage } from './explorer-ui-page.tsx'

export function ExplorerUiErrorPage({ message, title }: { message: string; title: string }) {
  return (
    <ExplorerUiPage>
      <UiError icon="explorer" message={new Error(message)} title={title} />
    </ExplorerUiPage>
  )
}
