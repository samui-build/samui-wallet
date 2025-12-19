import { assertIsAddress } from '@solana/kit'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useParams } from 'react-router'
import { useExplorerBackButtonTo } from './data-access/use-explorer-back-button-to.tsx'
import { ExplorerFeatureAccountOverview } from './explorer-feature-account-overview.tsx'
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
      <ExplorerFeatureAccountOverview
        address={address}
        backButtonTo={backButtonTo}
        basePath={basePath}
        network={network}
      />
    </UiPage>
  )
}
