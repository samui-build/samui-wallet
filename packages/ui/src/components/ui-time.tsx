import useRelativeTime from '@nkzw/use-relative-time'
import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

export function UiTime({ className, time, ...props }: { time: Date } & ComponentProps<'span'>) {
  const relative = useRelativeTime(time.getTime())
  return (
    <span className={cn('truncate whitespace-nowrap', className)} title={`${time.toLocaleString()}`} {...props}>
      {relative}
    </span>
  )
}
