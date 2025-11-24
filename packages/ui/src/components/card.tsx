import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

function Card({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-xl border bg-card py-2 text-card-foreground shadow-sm md:gap-6 md:py-6',
        className,
      )}
      data-slot="card"
      {...props}
    />
  )
}

function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      data-slot="card-action"
      {...props}
    />
  )
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mx-2 md:px-6', className)} data-slot="card-content" {...props} />
}

function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('text-muted-foreground text-sm', className)} data-slot="card-description" {...props} />
}

function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('mx-2 flex items-center md:px-6 [.border-t]:pt-6', className)}
      data-slot="card-footer"
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        '@container/card-header mx-2 grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] md:px-6 [.border-b]:pb-6',
        className,
      )}
      data-slot="card-header"
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('font-semibold leading-none', className)} data-slot="card-title" {...props} />
}

export { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle }
