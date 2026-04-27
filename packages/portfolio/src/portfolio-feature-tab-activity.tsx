import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { useGetActivity } from '@workspace/solana-client-react/use-get-activity'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { useLocation } from 'react-router'
import { PortfolioUiActivityList } from './ui/portfolio-ui-activity-list.tsx'
import { PortfolioUiActivityListSkeleton } from './ui/portfolio-ui-activity-list-skeleton.tsx'

export function PortfolioFeatureTabActivity({ account, network }: { account: Account; network: Network }) {
  const { t } = useTranslation('portfolio')
  const { pathname: from } = useLocation()
  const { data, error, isError, isLoading, isSuccess, refetch } = useGetActivity({
    address: account.publicKey,
    network,
  })

  return (
    <div className="space-y-2 px-2 md:px-0">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">{t(($) => $.pageTitleActivity)}</h2>
        <div className="space-x-2">
          <Button disabled={isLoading} onClick={() => refetch()} size="icon" variant="outline">
            {isLoading ? <Spinner /> : <UiIcon icon="refresh" />}
          </Button>
        </div>
      </div>
      {isError ? <pre className="alert alert-error">{error?.message.toString() ?? 'Unknown error'}</pre> : null}
      {isLoading ? <PortfolioUiActivityListSkeleton /> : null}
      {isSuccess ? <PortfolioUiActivityList from={from} items={data} network={network} /> : null}
    </div>
  )
}
