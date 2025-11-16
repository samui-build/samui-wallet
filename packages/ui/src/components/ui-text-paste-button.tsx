import { LucideCopy } from 'lucide-react'

import { handleTextPaste } from '../lib/handle-text-paste.ts'
import { Button } from './button.tsx'

export function UiTextPasteButton({ label, onPaste }: { label: string; onPaste: (text: string) => void }) {
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
      {label}
    </Button>
  )
}
