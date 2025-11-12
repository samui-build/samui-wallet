import { LucideCopy } from 'lucide-react'

import { handleCopyText } from '../lib/handle-copy-text.ts'
import { toastSuccess } from '../lib/toast-success.ts'
import { Button } from './button.tsx'

export function UiTextCopyButton({ label, text, toast }: { label: string; text: string; toast: string }) {
  return (
    <Button
      onClick={() => {
        handleCopyText(text)
        if (toast) {
          toastSuccess(toast)
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
