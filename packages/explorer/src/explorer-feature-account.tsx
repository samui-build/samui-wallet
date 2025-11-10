import { useParams } from 'react-router'
import { ExplorerUiEmpty } from './ui/explorer-ui-empty.tsx'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureAccount() {
  // TODO: Validate if this address is valid
  const { address } = useParams() as { address: string }
  return (
    <ExplorerUiPage>
      <ExplorerUiEmpty description="Placeholder for the Explorer Account page" title="Explorer Account">
        <pre>Address</pre>
        <pre>{address}</pre>
      </ExplorerUiEmpty>
    </ExplorerUiPage>
  )
}
