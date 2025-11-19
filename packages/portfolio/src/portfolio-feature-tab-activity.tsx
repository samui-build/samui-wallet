import { useDbAccountActive } from '@workspace/db-react/use-db-account-active'
import { useDbNetworkActive } from '@workspace/db-react/use-db-network-active'
import { useGetActivity } from '@workspace/solana-client-react/use-get-activity'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useLocation } from 'react-router'
import { PortfolioUiActivityList } from './ui/portfolio-ui-activity-list.tsx'

export function PortfolioFeatureTabActivity() {
  const account = useDbAccountActive()
  const network = useDbNetworkActive()
  const { pathname: from } = useLocation()
  const { data, error, isError, isLoading, isSuccess, refetch } = useGetActivity({
    address: account.publicKey,
    network,
  })

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Activity</h2>
        <div className="space-x-2">
          <Button disabled={isLoading} onClick={() => refetch()} size="icon" variant="outline">
            {isLoading ? <Spinner /> : <UiIcon icon="refresh" />}
          </Button>
        </div>
      </div>
      {isLoading ? <UiLoader /> : null}
      {isError ? <pre className="alert alert-error">Error: {error?.message.toString() ?? 'Unknown error'}</pre> : null}
      {isSuccess ? <PortfolioUiActivityList from={from} items={data} network={network} /> : null}
    </div>
  )
}
