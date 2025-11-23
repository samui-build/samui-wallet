import { assertIsSignature } from '@solana/kit'
import { solanaSignatureSchema } from '@workspace/db/solana/solana-signature-schema'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useLocation, useParams } from 'react-router'
import { ExplorerFeatureTxDetails } from './explorer-feature-tx-details.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureTx({ basePath }: { basePath: string }) {
  const network = useNetworkActive()
  const location = useLocation()
  const { signature } = useParams() as { signature: string }
  if (!signature || !solanaSignatureSchema.safeParse(signature).success) {
    return (
      <ExplorerUiErrorPage
        message="The provided signature is not a valid Solana signature."
        title="Invalid signature"
      />
    )
  }
  assertIsSignature(signature)
  const from = location.state?.from ?? basePath
  const backButtonTo = from.startsWith('/') ? from : `${basePath}/${from}`

  return (
    <UiPage>
      <UiCard backButtonTo={backButtonTo} title="Transaction">
        <ExplorerFeatureTxDetails basePath={basePath} network={network} signature={signature} />
      </UiCard>
    </UiPage>
  )
}
