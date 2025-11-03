import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('bg-accent animate-pulse rounded-md', className)} data-slot="skeleton" {...props} />
}

export { Skeleton }
