import { assertIsSignature } from '@solana/kit'
import { solanaSignatureSchema } from '@workspace/db/solana/solana-signature-schema'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useParams } from 'react-router'
import { useExplorerBackButtonTo } from './data-access/use-explorer-back-button-to.tsx'
import { ExplorerFeatureBookmarkTransactionButton } from './explorer-feature-bookmark-transaction-button.tsx'
import { ExplorerFeatureTransactionDetails } from './explorer-feature-transaction-details.tsx'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiExplorers } from './ui/explorer-ui-explorers.tsx'

export function ExplorerFeatureTransaction({ basePath }: { basePath: string }) {
  const network = useNetworkActive()
  const backButtonTo = useExplorerBackButtonTo({ basePath })
  const { signature } = useParams<{ signature: string }>()
  if (!signature || !solanaSignatureSchema.safeParse(signature).success) {
    return (
      <ExplorerUiErrorPage
        message="The provided signature is not a valid Solana signature."
        title="Invalid signature"
      />
    )
  }
  assertIsSignature(signature)

  return (
    <UiPage>
      <UiCard
        action={
          <div className="flex items-center gap-2">
            <ExplorerFeatureBookmarkTransactionButton signature={signature} />
          </div>
        }
        backButtonTo={backButtonTo}
        description={<ExplorerUiExplorers network={network} path={`/tx/${signature}`} />}
        title="Transaction"
      >
        <ExplorerFeatureTransactionDetails basePath={basePath} network={network} signature={signature} />
      </UiCard>
    </UiPage>
  )
}
