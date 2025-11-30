import type { GetActivityItem, GetActivityItems } from '@workspace/solana-client/get-activity'

import { unixTimestampToIsoDateString } from '@workspace/solana-client/unix-timestamp-to-iso-date-string'

export function groupActivityItems(txs: GetActivityItems): { date: Date; transactions: GetActivityItems }[] {
  const grouped = txs.reduce((acc, tx) => {
    const dateKey = unixTimestampToIsoDateString(tx.blockTime)

    const group = acc.get(dateKey)
    if (!group) {
      acc.set(dateKey, [tx])
    } else {
      group.push(tx)
    }

    return acc
  }, new Map<string, GetActivityItem[]>())

  return Array.from(grouped.entries()).map(([dateKey, transactions]) => ({
    date: new Date(dateKey),
    transactions,
  }))
}
