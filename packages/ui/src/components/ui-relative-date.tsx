import { format, isThisWeek, isToday, isYesterday } from 'date-fns'

export function UiRelativeDate({ date }: { date: Date }) {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  if (isThisWeek(date)) return format(date, 'EEEE')

  return format(date, 'MMM d')
}
