import type { Address } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useGetSignaturesForAddress } from '@workspace/solana-client-react/use-get-signatures-for-address'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ExplorerUiErrorPage } from './ui/explorer-ui-error-page.tsx'
import { ExplorerUiLinkTx } from './ui/explorer-ui-link-tx.tsx'
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
          Refresh
        </Button>
      }
      description="Recent transactions for this account"
      title={<div>Account Transactions</div>}
    >
      <div className="space-y-2">
        {transactions?.map((tx) => (
          <div className="flex items-center justify-between" key={tx.signature}>
            <div className="flex items-center gap-2">
              <ExplorerUiTxStatus tx={tx} />
              <ExplorerUiLinkTx basePath={basePath} signature={tx.signature} />
              <ExplorerUiTxExplorerIcon network={network} signature={tx.signature} />
            </div>
            <div className="font-mono text-xs text-muted-foreground text-right">
              <ExplorerUiTxTimestamp blockTime={tx.blockTime} />
            </div>
          </div>
        ))}
      </div>
    </UiCard>
  )
}
