import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '../lib/utils.ts'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive: 'bg-card text-red-500 *:data-[slot=alert-description]:text-muted-foreground [&>svg]:text-current',
        warning:
          'border-yellow-500 bg-card text-yellow-500 *:data-[slot=alert-description]:text-yellow-500/90 [&>svg]:text-current',
      },
    },
  },
)

function Alert({ className, variant, ...props }: ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div className={cn(alertVariants({ variant }), className)} data-slot="alert" role="alert" {...props} />
}

function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed',
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      data-slot="alert-title"
      {...props}
    />
  )
}

export { Alert, AlertDescription, AlertTitle }
