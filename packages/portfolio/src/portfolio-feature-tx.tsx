import type { Cluster } from '@workspace/db/entity/cluster'

import { useGetTransaction } from '@workspace/solana-client-react/use-get-transaction'
import { Alert, AlertTitle } from '@workspace/ui/components/alert'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useParams } from 'react-router'

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
      </Alert>
    )
  }

  return (
    <UiCard
      title={
        <div className="flex items-center gap-2">
          <UiBack to="/portfolio/activity" />
          Transaction : {ellipsify(signature, 8)}
        </div>
      }
    >
      <pre className="text-[10px] text-muted-foreground">{JSON.stringify(query.data, null, 2)}</pre>
    </UiCard>
  )
}
