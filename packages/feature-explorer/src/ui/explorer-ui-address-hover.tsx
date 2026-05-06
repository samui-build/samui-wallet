import type { Address } from '@solana/kit'
import { cn } from '@workspace/ui/lib/utils'
import type { ComponentProps } from 'react'
import { useAddressHover } from '../data-access/use-address-hover.ts'

export function ExplorerUiAddressHover({
  address,
  className,
  children,
  ...props
}: { address: Address } & ComponentProps<'div'>) {
  const { isHovered, onMouseEnter, onMouseLeave } = useAddressHover(address)

  return (
    <span
      className={cn('transition-colors duration-200', className, {
        'text-foreground': isHovered,
        'text-muted-foreground': !isHovered,
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="tooltip"
      {...props}
    >
      {children}
    </span>
  )
}
