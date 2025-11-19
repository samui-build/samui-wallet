import useRelativeTime from '@nkzw/use-relative-time'
import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

export function UiTime({ className, time, ...props }: { time: Date | number } & ComponentProps<'span'>) {
  const relative = useRelativeTime(time instanceof Date ? time.getTime() : time)
  return (
    <span className={cn('truncate whitespace-nowrap', className)} {...props}>
      {relative}
    </span>
  )
}
