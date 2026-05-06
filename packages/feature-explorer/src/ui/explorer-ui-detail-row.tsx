import { cn, cva, type VariantProps } from '@workspace/ui/lib/utils'
import type { ComponentProps, ReactNode } from 'react'

const detailRowVariants = cva('text-sm', {
  defaultVariants: {
    variant: 'default',
  },
  variants: {
    variant: {
      default: '',
      wide: 'flex items-center justify-between',
    },
  },
})

export interface ExplorerUiDetailRowProps
  extends Omit<ComponentProps<'div'>, 'children'>,
    VariantProps<typeof detailRowVariants> {
  label: string
  value: null | ReactNode | undefined
}

export function ExplorerUiDetailRow({ className, label, value, variant, ...props }: ExplorerUiDetailRowProps) {
  return (
    <div className={cn(detailRowVariants({ variant }), className)} {...props}>
      <div className="mb-1 text-xs tracking-wider opacity-60">{label}</div>
      <div className="break-all font-medium">{value ?? 'N/A'}</div>
    </div>
  )
}
