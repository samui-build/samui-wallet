import type { Cluster } from '@workspace/db/entity/cluster'
import type { TransactionData } from '@workspace/solana-client-react/use-get-transaction'

import { useGetTransaction } from '@workspace/solana-client-react/use-get-transaction'
import { Alert, AlertTitle } from '@workspace/ui/components/alert'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiBack } from '@workspace/ui/components/ui-back'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useParams } from 'react-router'

import { PortfolioUiTxDetails } from './portfolio-ui-tx-details.js'

export function PortfolioFeatureTx({ cluster }: { cluster: Cluster }) {
  const { signature } = useParams() as { signature: string }
  const query = useGetTransaction({ cluster, signature })

  if (query.isLoading) {
    return <Spinner />
  }

  if (!query.data) {
    return (
      <Alert variant="warning">
        <AlertTitle>Error loading transaction.</AlertTitle>
        <pre>{query.error?.message ?? 'Unknown reason'}</pre>
      </Alert>
    )
  }

  // @ts-expect-error Need to figure out how to get types from Kit without having to manually type all cases.
  const tx: TransactionData = query.data as TransactionData
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UiBack to="/portfolio/activity" />
        Transaction : {ellipsify(signature, 8)}
      </div>

      <PortfolioUiTxDetails cluster={cluster} signature={signature} tx={tx} />
    </div>
  )
}
