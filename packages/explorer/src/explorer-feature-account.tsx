import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { useParams } from 'react-router'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureAccount() {
  // TODO: Validate if this address is valid
  const { address } = useParams() as { address: string }
  return (
    <ExplorerUiPage>
      <UiEmpty description="Placeholder for the Explorer Account page" icon="explorer" title="Explorer Account">
        <pre>Address</pre>
        <pre>{address}</pre>
      </UiEmpty>
    </ExplorerUiPage>
  )
}
