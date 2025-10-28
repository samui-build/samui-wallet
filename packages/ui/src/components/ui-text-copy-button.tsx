import { LucideCopy } from 'lucide-react'

import { handleCopyText } from '../lib/handle-copy-text.js'
import { toastSuccess } from '../lib/toast-success.js'
import { Button } from './button.js'

export function UiTextCopyButton({ text, toast = 'Copied to clipboard' }: { text: string; toast?: string }) {
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
      Copy
    </Button>
  )
}
