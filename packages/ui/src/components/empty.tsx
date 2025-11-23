import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

function Empty({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 text-balance rounded-lg border-dashed p-2 text-center md:p-6 lg:p-12',
        className,
      )}
      data-slot="empty"
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex max-w-sm flex-col items-center text-center md:gap-2', className)}
      data-slot="empty-header"
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center md:mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-6",
      },
    },
  },
)

function EmptyContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-full min-w-0 flex-col items-center gap-4 text-balance text-sm md:max-w-md', className)}
      data-slot="empty-content"
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <div
      className={cn(
        'text-muted-foreground text-sm/relaxed [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      data-slot="empty-description"
      {...props}
    />
  )
}

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      className={cn(emptyMediaVariants({ className, variant }))}
      data-slot="empty-icon"
      data-variant={variant}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('font-medium text-lg tracking-tight', className)} data-slot="empty-title" {...props} />
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle }
