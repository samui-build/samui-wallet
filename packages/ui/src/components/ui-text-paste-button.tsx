import { LucideCopy } from 'lucide-react'

import { handleTextPaste } from '../lib/handle-text-paste.js'
import { Button } from './button.js'

export function UiTextPasteButton({ onPaste }: { onPaste: (text: string) => void }) {
  return (
    <Button
      onClick={async () => {
        const result = await handleTextPaste()
        if (result?.length) {
          onPaste(result)
        }
      }}
      type="button"
      variant="secondary"
    >
      <LucideCopy />
      Paste
    </Button>
  )
}
