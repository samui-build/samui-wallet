'use client'

import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useEffect, useRef } from 'react'
import type { CustomComponents, DayButton } from 'react-day-picker'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { cn } from '../lib/utils.ts'
import { Button, buttonVariants } from './button.tsx'

const baseComponents: Partial<CustomComponents> = {
  Chevron: ({ className, orientation, ...props }) => {
    if (orientation === 'left') {
      return <ChevronLeftIcon className={cn('size-4', className)} {...props} />
    }

    if (orientation === 'right') {
      return <ChevronRightIcon className={cn('size-4', className)} {...props} />
    }

    return <ChevronDownIcon className={cn('size-4', className)} {...props} />
  },
  DayButton: CalendarDayButton,
  Root: ({ className, rootRef, ...props }) => {
    return <div className={cn(className)} data-slot="calendar" ref={rootRef} {...props} />
  },
  WeekNumber: ({ children, ...props }) => {
    return (
      <td {...props}>
        <div className="flex size-(--cell-size) items-center justify-center text-center">{children}</div>
      </td>
    )
  },
}

function Calendar({
  buttonVariant = 'ghost',
  captionLayout = 'label',
  className,
  classNames,
  components,
  formatters,
  showOutsideDays = true,
  ...props
}: {
  buttonVariant?: ComponentProps<typeof Button>['variant']
} & ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      captionLayout={captionLayout}
      className={cn(
        'group/calendar bg-background p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_next,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) select-none p-0 aria-disabled:opacity-50',
          defaultClassNames.button_previous,
        ),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'flex h-8 items-center gap-1 rounded-md pr-1 pl-2 text-sm [&>svg]:size-3.5 [&>svg]:text-muted-foreground',
          defaultClassNames.caption_label,
        ),
        day: cn(
          'group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md',
          defaultClassNames.day,
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        dropdown: cn('absolute inset-0 bg-popover opacity-0', defaultClassNames.dropdown),
        dropdown_root: cn(
          'relative rounded-md border border-input shadow-xs has-focus:border-ring has-focus:ring-[3px] has-focus:ring-ring/50',
          defaultClassNames.dropdown_root,
        ),
        dropdowns: cn(
          'flex h-(--cell-size) w-full items-center justify-center gap-1.5 font-medium text-sm',
          defaultClassNames.dropdowns,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        month_caption: cn(
          'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        months: cn('relative flex flex-col gap-4 md:flex-row', defaultClassNames.months),
        nav: cn('absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1', defaultClassNames.nav),
        outside: cn('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
        range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
        root: cn('w-fit', defaultClassNames.root),
        table: 'w-full border-collapse',
        today: cn(
          'rounded-md bg-accent text-accent-foreground data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        week_number: cn('select-none text-[0.8rem] text-muted-foreground', defaultClassNames.week_number),
        week_number_header: cn('w-(--cell-size) select-none', defaultClassNames.week_number_header),
        weekday: cn(
          'flex-1 select-none rounded-md font-normal text-[0.8rem] text-muted-foreground',
          defaultClassNames.weekday,
        ),
        weekdays: cn('flex', defaultClassNames.weekdays),
        ...classNames,
      }}
      components={{
        ...baseComponents,
        ...components,
      }}
      formatters={{
        formatMonthDropdown: (date) => date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  )
}

function CalendarDayButton({ className, day, modifiers, ...props }: ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (modifiers['focused']) ref.current?.focus()
  }, [modifiers['focused']])

  return (
    <Button
      className={cn(
        'flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-start=true]:rounded-l-md data-[range-end=true]:bg-primary data-[range-middle=true]:bg-accent data-[range-start=true]:bg-primary data-[selected-single=true]:bg-primary data-[range-end=true]:text-primary-foreground data-[range-middle=true]:text-accent-foreground data-[range-start=true]:text-primary-foreground data-[selected-single=true]:text-primary-foreground group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground [&>span]:text-xs [&>span]:opacity-70',
        defaultClassNames.day,
        className,
      )}
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers['range_end']}
      data-range-middle={modifiers['range_middle']}
      data-range-start={modifiers['range_start']}
      data-selected-single={
        modifiers['selected'] && !modifiers['range_start'] && !modifiers['range_end'] && !modifiers['range_middle']
      }
      ref={ref}
      size="icon"
      variant="ghost"
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
