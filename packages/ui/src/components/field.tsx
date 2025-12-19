'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps, ReactNode } from 'react'
import { useMemo } from 'react'

import { cn } from '../lib/utils.ts'
import { Label } from './label.tsx'
import { Separator } from './separator.tsx'

function FieldGroup({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
        className,
      )}
      data-slot="field-group"
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: { variant?: 'label' | 'legend' } & ComponentProps<'legend'>) {
  return (
    <legend
      className={cn('mb-3 font-medium', 'data-[variant=legend]:text-base', 'data-[variant=label]:text-sm', className)}
      data-slot="field-legend"
      data-variant={variant}
      {...props}
    />
  )
}

function FieldSet({ className, ...props }: ComponentProps<'fieldset'>) {
  return (
    <fieldset
      className={cn(
        'flex flex-col gap-6',
        'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
        className,
      )}
      data-slot="field-set"
      {...props}
    />
  )
}

const fieldVariants = cva('group/field flex w-full gap-3 data-[invalid=true]:text-destructive', {
  defaultVariants: {
    orientation: 'vertical',
  },
  variants: {
    orientation: {
      horizontal: [
        'flex-row items-center',
        '[&>[data-slot=field-label]]:flex-auto',
        'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
      responsive: [
        '@md/field-group:flex-row flex-col @md/field-group:items-center @md/field-group:[&>*]:w-auto [&>*]:w-full [&>.sr-only]:w-auto',
        '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
        '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
      ],
      vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
    },
  },
})

function Field({
  className,
  orientation = 'vertical',
  ...props
}: ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: this should not be a fieldset
    <div
      className={cn(fieldVariants({ orientation }), className)}
      data-orientation={orientation}
      data-slot="field"
      role="group"
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('group/field-content flex flex-1 flex-col gap-1.5 leading-snug', className)}
      data-slot="field-content"
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'font-normal text-muted-foreground text-sm leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
        'nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className,
      )}
      data-slot="field-description"
      {...props}
    />
  )
}

function FieldError({
  children,
  className,
  errors,
  ...props
}: {
  errors?: Array<{ message?: string } | undefined>
} & ComponentProps<'div'>) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [...new Map(errors.map((error) => [error?.message, error])).values()]

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map((error) => error?.message && <li key={error.message}>{error.message}</li>)}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      className={cn('font-normal text-destructive text-sm', className)}
      data-slot="field-error"
      role="alert"
      {...props}
    >
      {content}
    </div>
  )
}

function FieldLabel({ className, ...props }: ComponentProps<typeof Label>) {
  return (
    <Label
      className={cn(
        'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
        'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4',
        'has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/5 dark:has-data-[state=checked]:bg-primary/10',
        className,
      )}
      data-slot="field-label"
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: {
  children?: ReactNode
} & ComponentProps<'div'>) {
  return (
    <div
      className={cn('relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2', className)}
      data-content={!!children}
      data-slot="field-separator"
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-background px-2 text-muted-foreground"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldTitle({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex w-fit items-center gap-2 font-medium text-sm leading-snug group-data-[disabled=true]/field:opacity-50',
        className,
      )}
      data-slot="field-label"
      {...props}
    />
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
