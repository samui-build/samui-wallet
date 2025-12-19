import { UiError } from '@workspace/ui/components/ui-error'
import { UiPage } from '@workspace/ui/components/ui-page'

export function ExplorerUiErrorPage({ message, title }: { message: string; title: string }) {
  return (
    <UiPage>
      <ExplorerUiError message={message} title={title} />
    </UiPage>
  )
}

export function ExplorerUiError({ message, title }: { message: string; title: string }) {
  return <UiError icon="explorer" message={new Error(message)} title={title} />
}
