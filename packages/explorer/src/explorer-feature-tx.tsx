import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { useParams } from 'react-router'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureTx() {
  // TODO: Validate if this signature is valid
  const { signature } = useParams() as { signature: string }

  return (
    <ExplorerUiPage>
      <UiEmpty description="Placeholder for the Explorer Transaction page" icon="explorer" title="Explorer Transaction">
        <pre>Signature</pre>
        <pre className="max-w-full truncate">{signature}</pre>
      </UiEmpty>
    </ExplorerUiPage>
  )
}
