import { solanaAddressSchema } from '@workspace/db/schema/solana-address-schema'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { useParams } from 'react-router'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureAccount() {
  const { address } = useParams()
  if (!address || !solanaAddressSchema.safeParse(address).success) {
    return <ExplorerUiErrorPage message="The provided address is not a valid Solana address." title="Invalid address" />
  }

  return (
    <ExplorerUiPage>
      <UiEmpty description="Placeholder for the Explorer Account page" icon="explorer" title="Explorer Account">
        <pre>Address</pre>
        <pre>{address}</pre>
      </UiEmpty>
    </ExplorerUiPage>
  )
}
