import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useGetActivity } from '@workspace/solana-client-react/use-get-activity'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { RefreshCw } from 'lucide-react'

import { PortfolioUiGetActivity } from './ui/portfolio-ui-get-activity.js'

export function PortfolioFeatureGetActivity(props: { cluster: Cluster; wallet: Wallet }) {
  const { data, error, isError, isLoading, isSuccess, refetch } = useGetActivity(props)

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Activity</h2>
        <div className="space-x-2">
          {isLoading ? (
            <Spinner />
          ) : (
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw size={16} />
            </Button>
          )}
        </div>
      </div>
      {isLoading ? <UiLoader /> : null}
      {isError ? <pre className="alert alert-error">Error: {error?.message.toString()}</pre> : null}
      {isSuccess ? <PortfolioUiGetActivity cluster={props.cluster} items={data} /> : null}
    </div>
  )
}
