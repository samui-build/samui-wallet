import { assertIsSignature } from '@solana/kit'
import type { Network } from '@workspace/db/entity/network'
import { solanaSignatureSchema } from '@workspace/db/schema/solana-signature-schema'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useLocation, useParams } from 'react-router'
import { ExplorerFeatureTxDetails } from './explorer-feature-tx-details.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'

export function ExplorerFeatureTx({ basePath, network }: { basePath: string; network: Network }) {
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
