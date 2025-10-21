import type { UnixTimestamp } from '@solana/kit'

export function unixTimestampToDate(time: null | UnixTimestamp) {
  if (!time) {
    return null
  }
  return new Date(Number(time) * 1000)
}
