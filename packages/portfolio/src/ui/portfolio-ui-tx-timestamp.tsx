import type { UnixTimestamp } from '@workspace/solana-client'

import { unixTimestampToDate } from '@workspace/solana-client/unix-timestamp-to-date'

export function PortfolioUiTxTimestamp({ blockTime }: { blockTime: null | UnixTimestamp }) {
  const date = unixTimestampToDate(blockTime)
  if (!date) {
    return null
  }
  return date.toLocaleString()
}
