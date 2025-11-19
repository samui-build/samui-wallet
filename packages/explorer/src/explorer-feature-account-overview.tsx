import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerUiDetailRow } from './ui/explorer-ui-detail-row.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiExplorers } from './ui/explorer-ui-explorers.tsx'

export function ExplorerFeatureAccountOverview({ address, network }: { address: Address; network: Network }) {
  const query = useGetAccountInfo({ address, network })
  if (query.isLoading) {
    return <UiLoader />
  }
  if (query.isError) {
    return <ExplorerUiErrorPage message={query.error.message} title="Error getting account overview" />
  }

  return (
    <UiCard
      action={
        <Button onClick={() => query.refetch()} size="sm" variant="secondary">
          <UiIcon icon="refresh" />
          Refresh
        </Button>
      }
      description={<ExplorerUiExplorers network={network} path={`/address/${address}`} />}
      title={<div>Account Overview</div>}
    >
      <div className="space-y-2 sm:space-y-4 lg:space-y-6">
        <ExplorerUiDetailRow label="Address" value={address} />
        <ExplorerUiDetailRow label="Owner" value={query.data?.value?.owner} />
        <ExplorerUiDetailRow label="Lamports" value={query.data?.value?.lamports} />
      </div>
    </UiCard>
  )
}
