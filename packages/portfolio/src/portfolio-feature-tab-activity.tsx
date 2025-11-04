import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useGetActivity } from '@workspace/solana-client-react/use-get-activity'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { LucideRefreshCw } from 'lucide-react'

import { PortfolioUiGetActivity } from './ui/portfolio-ui-get-activity.tsx'

export function PortfolioFeatureTabActivity(props: { cluster: Cluster; wallet: Wallet }) {
  const { data, error, isError, isLoading, isSuccess, refetch } = useGetActivity({
    address: props.wallet.publicKey,
    cluster: props.cluster,
  })

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Activity</h2>
        <div className="space-x-2">
          <Button disabled={isLoading} onClick={() => refetch()} size="icon" variant="outline">
            {isLoading ? <Spinner /> : <LucideRefreshCw />}
          </Button>
        </div>
      </div>
      {isLoading ? <UiLoader /> : null}
      {isError ? <pre className="alert alert-error">Error: {error?.message.toString() ?? 'Unknown error'}</pre> : null}
      {isSuccess ? <PortfolioUiGetActivity cluster={props.cluster} items={data} /> : null}
    </div>
  )
}
