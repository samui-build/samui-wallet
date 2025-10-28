import type { GetActivityItem } from '@workspace/solana-client/get-activity'

import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link } from 'react-router'

export function PortfolioUiTxLink({ tx }: { tx: GetActivityItem }) {
  return (
    <Link className="text-sm font-mono cursor-pointer" to={`/portfolio/tx/${tx.signature}`}>
      {ellipsify(tx.signature, 8)}
    </Link>
  )
}
