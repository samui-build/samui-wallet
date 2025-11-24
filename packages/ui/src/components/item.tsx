import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '../lib/utils.ts'
import { Separator } from './separator.tsx'

function ItemGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: this should not be a ul/ol
    <div className={cn('group/item-group flex flex-col', className)} data-slot="item-group" role="list" {...props} />
  )
}

function ItemSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return <Separator className={cn('my-0', className)} data-slot="item-separator" orientation="horizontal" {...props} />
}

const itemVariants = cva(
  'group/item flex flex-wrap items-center rounded-md border border-transparent text-sm outline-none transition-colors duration-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-accent/50',
  {
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
    variants: {
      size: {
        default: 'gap-2 p-2 md:gap-4 md:p-4',
        sm: 'gap-2.5 px-4 py-3',
      },
      variant: {
        default: 'bg-transparent',
        muted: 'bg-muted/50',
        outline: 'border-border',
      },
    },
  },
)

function Item({
  asChild = false,
  className,
  size = 'default',
  variant = 'default',
  ...props
}: { asChild?: boolean } & ComponentProps<'div'> & VariantProps<typeof itemVariants>) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      className={cn(itemVariants({ className, size, variant }))}
      data-size={size}
      data-slot="item"
      data-variant={variant}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  'flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none',
  {
    defaultVariants: {
      variant: 'default',
    },
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "size-8 rounded-sm border bg-muted [&_svg:not([class*='size-'])]:size-4",
        image: 'size-10 overflow-hidden rounded-sm [&_img]:size-full [&_img]:object-cover',
      },
    },
  },
)

function ItemActions({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex items-center gap-2', className)} data-slot="item-actions" {...props} />
}

function ItemContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none', className)}
      data-slot="item-content"
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'line-clamp-2 text-balance font-normal text-muted-foreground text-sm leading-normal',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      data-slot="item-description"
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      data-slot="item-footer"
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex basis-full items-center justify-between gap-2', className)}
      data-slot="item-header"
      {...props}
    />
  )
}

function ItemMedia({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      className={cn(itemMediaVariants({ className, variant }))}
      data-slot="item-media"
      data-variant={variant}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex w-fit items-center gap-2 font-medium text-sm leading-snug', className)}
      data-slot="item-title"
      {...props}
    />
  )
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
}
