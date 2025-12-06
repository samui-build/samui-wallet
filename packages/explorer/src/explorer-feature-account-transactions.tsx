import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { useGetSignaturesForAddress } from '@workspace/solana-client-react/use-get-signatures-for-address'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiLinkSignature } from './ui/explorer-ui-link-signature.tsx'
import { ExplorerUiTxExplorerIcon } from './ui/explorer-ui-tx-explorer-icon.tsx'
import { ExplorerUiTxStatus } from './ui/explorer-ui-tx-status.tsx'
import { ExplorerUiTxTimestamp } from './ui/explorer-ui-tx-timestamp.tsx'

export function ExplorerFeatureAccountTransactions({
  address,
  basePath,
  network,
}: {
  address: Address
  basePath: string
  network: Network
}) {
  const { t } = useTranslation('explorer')
  const query = useGetSignaturesForAddress({ address, network })
  if (query.isLoading) {
    return <UiLoader />
  }
  if (query.isError) {
    return <ExplorerUiErrorPage message={query.error.message} title="Error getting account transactions" />
  }

  const transactions = query.data ?? []
  return (
    <UiCard
      action={
        <Button onClick={() => query.refetch()} size="sm" variant="secondary">
          <UiIcon icon="refresh" />
          {t(($) => $.actionRefresh)}
        </Button>
      }
      description={t(($) => $.transactionsOverviewDescription)}
      title={<div>{t(($) => $.transactionsOverviewTitle)}</div>}
    >
      <div className="space-y-2">
        {transactions?.map((tx) => (
          <div className="flex items-center justify-between" key={tx.signature}>
            <div className="flex items-center gap-2">
              <ExplorerUiTxStatus tx={tx} />
              <ExplorerUiLinkSignature basePath={basePath} signature={tx.signature} />
              <ExplorerUiTxExplorerIcon network={network} signature={tx.signature} />
            </div>
            <div className="text-right font-mono text-muted-foreground text-xs">
              <ExplorerUiTxTimestamp blockTime={tx.blockTime} />
            </div>
          </div>
        ))}
      </div>
    </UiCard>
  )
}
