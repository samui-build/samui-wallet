import { assertIsAddress } from '@solana/kit'
import type { Network } from '@workspace/db/entity/network'
import { solanaAddressSchema } from '@workspace/db/schema/solana-address-schema'
import { useParams } from 'react-router'
import { ExplorerFeatureAccountOverview } from './explorer-feature-account-overview.tsx'
import { ExplorerFeatureAccountTransactions } from './explorer-feature-account-transactions.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureAccount({ basePath, network }: { basePath: string; network: Network }) {
  const { address } = useParams()
  if (!address || !solanaAddressSchema.safeParse(address).success) {
    return <ExplorerUiErrorPage message="The provided address is not a valid Solana address." title="Invalid address" />
  }
  assertIsAddress(address)

  return (
    <ExplorerUiPage>
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        <ExplorerFeatureAccountOverview address={address} network={network} />
        <ExplorerFeatureAccountTransactions address={address} basePath={basePath} network={network} />
      </div>
    </ExplorerUiPage>
  )
}
