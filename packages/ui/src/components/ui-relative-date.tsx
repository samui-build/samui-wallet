import { useTranslation } from '@workspace/i18n'
import { format, isThisWeek, isToday, isYesterday } from 'date-fns'
import type { ComponentProps } from 'react'
import { cn } from '../lib/utils.ts'

function useRelativeDate({ date }: { date: Date }) {
  const { t } = useTranslation('ui')
  if (isToday(date)) {
    return t(($) => $.relativeDateToday)
  }
  if (isYesterday(date)) {
    return t(($) => $.relativeDateYesterday)
  }
  if (isThisWeek(date)) {
    // TODO: Use date-fns locales
    return format(date, 'EEEE')
  }
  return format(date, 'MMM d')
}

export function UiRelativeDate({ className, date, ...props }: { date: Date } & ComponentProps<'span'>) {
  const relative = useRelativeDate({ date })

  return (
    <span className={cn('truncate whitespace-nowrap', className)} title={`${date.toLocaleDateString()}`} {...props}>
      {relative}
    </span>
  )
}
