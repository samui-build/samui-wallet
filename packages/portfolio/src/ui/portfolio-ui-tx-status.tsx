import type { GetActivityItem } from '@workspace/solana-client/get-activity'

import { LucideCheckCircle, LucideCircleX } from 'lucide-react'

export function PortfolioUiTxStatus({ tx }: { tx: GetActivityItem }) {
  return tx.err ? (
    <LucideCircleX className="text-red-500 size-4" />
  ) : (
    <LucideCheckCircle className="text-green-500 size-4" />
  )
}
