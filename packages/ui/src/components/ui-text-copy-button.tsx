import { LucideCopy } from 'lucide-react'

import { handleCopyText } from '../lib/handle-copy-text.ts'
import { toastError } from '../lib/toast-error.ts'
import { toastSuccess } from '../lib/toast-success.ts'
import { Button } from './button.tsx'

export function UiTextCopyButton({ label, text, toast }: { label: string; text: string; toast: string }) {
  return (
    <Button
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
      <LucideCopy />
      {label}
    </Button>
  )
}
