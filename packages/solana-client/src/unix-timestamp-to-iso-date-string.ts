import type { UnixTimestamp } from '@solana/kit'
import { unixTimestampToDate } from './unix-timestamp-to-date.ts'

export function unixTimestampToIsoDateString(time: null | UnixTimestamp) {
  const timestamp = unixTimestampToDate(time) ?? new Date()
  const year = timestamp.getFullYear()
  const month = (timestamp.getMonth() + 1).toString().padStart(2, '0')
  const day = timestamp.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}
