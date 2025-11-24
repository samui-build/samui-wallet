import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'
import { UiIcon } from './ui-icon.tsx'
import type { HandleCopyTextProps } from './use-handle-copy-text.tsx'
import { useHandleCopyText } from './use-handle-copy-text.tsx'

export function UiTextCopyIcon({ text, toast, toastFailed, ...props }: ComponentProps<'button'> & HandleCopyTextProps) {
  const { copied, handleCopy } = useHandleCopyText({ text, toast, toastFailed })

  return (
    <button className="cursor-pointer" onClick={handleCopy} type="button" {...props}>
      <UiIcon className={cn('size-3', { 'text-green-500': copied })} icon={copied ? 'copyCheck' : 'copy'} />
    </button>
  )
}
