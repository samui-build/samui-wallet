import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useGetAccountInfo } from '@workspace/solana-client-react/use-get-account-info'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureAccountDebug({ address, network }: { address: Address; network: Network }) {
  const query = useGetAccountInfo({ address, network })
  if (query.isLoading) {
    return <UiLoader />
  }
  if (query.isError) {
    return <ExplorerUiErrorPage message={query.error.message} title="Error getting account overview" />
  }
  if (!query.data) {
    return <ExplorerUiErrorPage message="No data found" title="Error getting account" />
  }

  return (
    <UiCard>
      <UiDebug data={query.data} />
    </UiCard>
  )
}
