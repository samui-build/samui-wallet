import { cn } from '@workspace/ui/lib/utils'
import type { ComponentProps } from 'react'

export function ExplorerUiDetailGrid({
  cols = 1,
  children,
  className,
  ...props
}: { cols?: 1 | 2 } & ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-y-2 md:gap-y-6',
        {
          'md:grid-cols-2 md:gap-6': cols === 2,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
