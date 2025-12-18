import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

export type UiPreProps = ComponentProps<'pre'>
export function UiPre({ children, className, ...props }: UiPreProps) {
  return (
    <pre className={cn('overflow-auto whitespace-pre-wrap text-[9px]', className)} {...props}>
      {children}
    </pre>
  )
}
