import type { GetActivityItem } from '@workspace/solana-client/get-activity'

import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { Link } from 'react-router'

export function ExplorerUiTxLink({ basePath, from, tx }: { basePath: string; from: string; tx: GetActivityItem }) {
  return (
    <Link className="text-sm font-mono cursor-pointer" state={{ from }} to={`${basePath}/tx/${tx.signature}`}>
      {ellipsify(tx.signature, 8)}
    </Link>
  )
}
