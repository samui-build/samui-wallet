import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'
import { Button } from './button.tsx'
import { UiIcon } from './ui-icon.tsx'
import { type HandleCopyProps, useHandleCopyText } from './use-handle-copy-text.tsx'

export function UiTextCopyButton({
  label,
  text,
  toast,
  toastFailed,
  ...props
}: ComponentProps<typeof Button> & HandleCopyProps & { label: string }) {
  const { copied, handleCopy } = useHandleCopyText()

  return (
    <Button
      className="cursor-pointer"
      onClick={() => handleCopy({ text, toast, toastFailed })}
      type="button"
      variant="secondary"
      {...props}
    >
      <UiIcon className={cn({ 'text-green-500': copied })} icon={copied ? 'copyCheck' : 'copy'} />
      {label}
    </Button>
  )
}
