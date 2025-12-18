import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useGetTokenAccountInfo } from '@workspace/solana-client-react/use-get-token-account-info'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureAccountOwnerToken({ address, network }: { address: Address; network: Network }) {
  const query = useGetTokenAccountInfo({ address, network })

  if (query.isError) {
    return <ExplorerUiErrorPage message={query.error.message} title="Error getting account overview" />
  }

  if (!query.isLoading && !query.data?.exists) {
    return <ExplorerUiErrorPage message="Account does not exist" title="Error getting account" />
  }

  return query.isLoading ? (
    <UiLoader />
  ) : query.data?.exists ? (
    <div className="space-y-2 sm:space-y-4 lg:space-y-6">
      <UiDebug data={query.data} />
    </div>
  ) : null
}
