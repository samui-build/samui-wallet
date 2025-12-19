import { assertIsAddress } from '@solana/kit'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { UiPage } from '@workspace/ui/components/ui-page'
import { UiTabRoutes } from '@workspace/ui/components/ui-tab-routes'
import { useParams } from 'react-router'
import { useExplorerBackButtonTo } from './data-access/use-explorer-back-button-to.tsx'
import { ExplorerFeatureAccountDebug } from './explorer-feature-account-debug.tsx'
import { ExplorerFeatureAccountOverview } from './explorer-feature-account-overview.tsx'
import { ExplorerFeatureAccountTransactions } from './explorer-feature-account-transactions.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureAccount({ basePath }: { basePath: string }) {
  const network = useNetworkActive()
  const backButtonTo = useExplorerBackButtonTo({ basePath })
  const { address } = useParams()
  if (!address || !solanaAddressSchema.safeParse(address).success) {
    return <ExplorerUiErrorPage message="The provided address is not a valid Solana address." title="Invalid address" />
  }
  assertIsAddress(address)

  return (
    <UiPage>
      <div className="space-y-2 sm:space-y-4 md:space-y-6">
        <ExplorerFeatureAccountOverview
          address={address}
          backButtonTo={backButtonTo}
          basePath={basePath}
          network={network}
        />
        <UiTabRoutes
          basePath={`${basePath}/address/${address}`}
          tabs={[
            {
              element: <ExplorerFeatureAccountTransactions address={address} basePath={basePath} network={network} />,
              label: 'Transactions',
              path: 'transactions',
            },
            {
              element: <ExplorerFeatureAccountDebug address={address} network={network} />,
              label: 'Debug',
              path: 'debug',
            },
          ]}
        />
      </div>
    </UiPage>
  )
}
