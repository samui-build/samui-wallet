import { UiError } from '@workspace/ui/components/ui-error'

export function ExplorerUiError({ message, title }: { message: string; title: string }) {
  return <UiError icon="explorer" message={new Error(message)} title={title} />
}
