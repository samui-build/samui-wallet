import { useTranslation } from '@workspace/i18n'
import { format, isThisWeek, isToday, isYesterday } from 'date-fns'

export function UiRelativeDate({ date }: { date: Date }) {
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
