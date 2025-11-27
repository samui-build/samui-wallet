import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'
import { UiIcon } from './ui-icon.tsx'
import type { HandleCopyProps } from './use-handle-copy-text.tsx'
import { useHandleCopyText } from './use-handle-copy-text.tsx'

export function UiTextCopyIcon({ text, toast, toastFailed, ...props }: ComponentProps<'button'> & HandleCopyProps) {
  const { copied, handleCopy } = useHandleCopyText()

  return (
    <button
      className="cursor-pointer"
      onClick={() => handleCopy({ text, toast, toastFailed })}
      type="button"
      {...props}
    >
      <UiIcon className={cn('size-3', { 'text-green-500': copied })} icon={copied ? 'copyCheck' : 'copy'} />
    </button>
  )
}
