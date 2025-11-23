import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

export function UiPage({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'container mx-auto p-0 sm:max-w-3xl sm:p-2 md:max-w-4xl md:p-4 lg:max-w-5xl lg:p-6 xl:max-w-6xl xl:p-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
