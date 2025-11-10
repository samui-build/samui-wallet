import { useParams } from 'react-router'
import { ExplorerUiEmpty } from './ui/explorer-ui-empty.tsx'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export function ExplorerFeatureTx() {
  // TODO: Validate if this signature is valid
  const { signature } = useParams() as { signature: string }

  return (
    <ExplorerUiPage>
      <ExplorerUiEmpty description="Placeholder for the Explorer Transaction page" title="Explorer Transaction">
        <pre>Signature</pre>
        <pre className="max-w-full truncate">{signature}</pre>
      </ExplorerUiEmpty>
    </ExplorerUiPage>
  )
}
