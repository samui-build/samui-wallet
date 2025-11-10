import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

export function UiContainer({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('container mx-auto px-2 md:px-4 sm:px-6 lg:px-8', className)} {...props}>
      {children}
    </div>
  )
}
