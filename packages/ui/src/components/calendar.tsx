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
        'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      classNames={{
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_next,
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-(--cell-size) aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_previous,
        ),
        caption_label: cn(
          'select-none font-medium',
          captionLayout === 'label'
            ? 'text-sm'
            : 'rounded-md pl-2 pr-1 flex items-center gap-1 text-sm h-8 [&>svg]:text-muted-foreground [&>svg]:size-3.5',
          defaultClassNames.caption_label,
        ),
        day: cn(
          'relative w-full h-full p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md group/day aspect-square select-none',
          defaultClassNames.day,
        ),
        disabled: cn('text-muted-foreground opacity-50', defaultClassNames.disabled),
        dropdown: cn('absolute bg-popover inset-0 opacity-0', defaultClassNames.dropdown),
        dropdown_root: cn(
          'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root,
        ),
        dropdowns: cn(
          'w-full flex items-center text-sm font-medium justify-center h-(--cell-size) gap-1.5',
          defaultClassNames.dropdowns,
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        month: cn('flex flex-col w-full gap-4', defaultClassNames.month),
        month_caption: cn(
          'flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)',
          defaultClassNames.month_caption,
        ),
        months: cn('flex gap-4 flex-col md:flex-row relative', defaultClassNames.months),
        nav: cn('flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between', defaultClassNames.nav),
        outside: cn('text-muted-foreground aria-selected:text-muted-foreground', defaultClassNames.outside),
        range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_start: cn('rounded-l-md bg-accent', defaultClassNames.range_start),
        root: cn('w-fit', defaultClassNames.root),
        table: 'w-full border-collapse',
        today: cn(
          'bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none',
          defaultClassNames.today,
        ),
        week: cn('flex w-full mt-2', defaultClassNames.week),
        week_number: cn('text-[0.8rem] select-none text-muted-foreground', defaultClassNames.week_number),
        week_number_header: cn('select-none w-(--cell-size)', defaultClassNames.week_number_header),
        weekday: cn(
          'text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none',
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
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 dark:hover:text-accent-foreground flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] data-[range-end=true]:rounded-md data-[range-end=true]:rounded-r-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md data-[range-start=true]:rounded-l-md [&>span]:text-xs [&>span]:opacity-70',
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
