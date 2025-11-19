import type { GetActivityItem, GetActivityItems } from '@workspace/solana-client/get-activity'

import { unixTimestampToDate } from '@workspace/solana-client/unix-timestamp-to-date'

export function groupActivityItems(txs: GetActivityItems): { date: Date; transactions: GetActivityItems }[] {
  const grouped = txs.reduce((acc, tx) => {
    const timestamp = unixTimestampToDate(tx.blockTime) ?? new Date()
    const dateKey = timestamp.toISOString().split('T')[0] ?? ''

    const group = acc.get(dateKey)
    if (!group) {
      acc.set(dateKey, [tx])
    } else {
      group.push(tx)
    }

    return acc
  }, new Map<string, GetActivityItem[]>())

  return Array.from(grouped.entries()).map(([dateKey, transactions]) => ({
    date: unixTimestampToDate(transactions[0]?.blockTime ?? null) ?? new Date(dateKey),
    transactions,
  }))
}
