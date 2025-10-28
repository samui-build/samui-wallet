import type { GetActivityItem } from '@workspace/solana-client/get-activity'

import { unixTimestampToDate } from '@workspace/solana-client/unix-timestamp-to-date'

export function PortfolioUiTxTimestamp({ tx }: { tx: GetActivityItem }) {
  const date = unixTimestampToDate(tx.blockTime)
  if (!date) {
    return null
  }
  return date.toLocaleString()
}
