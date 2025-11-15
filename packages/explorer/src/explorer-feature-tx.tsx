import { solanaSignatureSchema } from '@workspace/db/schema/solana-signature-schema'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useParams } from 'react-router'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureTx() {
  const { signature } = useParams() as { signature: string }
  if (!signature || !solanaSignatureSchema.safeParse(signature).success) {
    return (
      <ExplorerUiErrorPage
        message="The provided signature is not a valid Solana signature."
        title="Invalid signature"
      />
    )
  }

  return (
    <UiPage>
      <UiEmpty description="Placeholder for the Explorer Transaction page" icon="explorer" title="Explorer Transaction">
        <pre>Signature</pre>
        <pre className="max-w-full truncate">{signature}</pre>
      </UiEmpty>
    </UiPage>
  )
}
