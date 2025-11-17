import { handleCopyText } from '../lib/handle-copy-text.ts'
import { toastError } from '../lib/toast-error.ts'
import { toastSuccess } from '../lib/toast-success.ts'
import { Button } from './button.tsx'
import { UiIcon } from './ui-icon.tsx'

export function UiTextCopyButton({ label, text, toast }: { label: string; text: string; toast: string }) {
  return (
    <Button
      className="cursor-pointer"
      onClick={async () => {
        try {
          await handleCopyText(text)
          if (toast) {
            toastSuccess(toast)
          }
        } catch (error) {
          toastError(error instanceof Error ? error.message : 'Failed to copy text')
        }
      }}
      type="button"
      variant="secondary"
    >
      <UiIcon icon="copy" />
      {label}
    </Button>
  )
}
