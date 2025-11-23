import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

function Skeleton({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('animate-pulse rounded-md bg-accent', className)} data-slot="skeleton" {...props} />
}

export { Skeleton }
