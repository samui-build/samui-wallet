import useRelativeTime from '@nkzw/use-relative-time'

export function UiTime({ time }: { time?: Date | null | number }) {
  time = time ?? 0
  return useRelativeTime(time instanceof Date ? time.getTime() : time)
}
