import type { Cluster } from '@workspace/db/entity/cluster'
import type { TransactionData } from '@workspace/solana-client-react/use-get-transaction'

import { Separator } from '@workspace/ui/components/separator'

import { getTxStatus } from './get-tx-status.js'
import { PortfolioUiTxDetailRow } from './portfolio-ui-tx-detail-row.js'
import { PortfolioUiExplorerButton } from './ui/portfolio-ui-explorer-button.js'
import { PortfolioUiTxTimestamp } from './ui/portfolio-ui-tx-timestamp.js'

export function PortfolioUiTxDetails({
  cluster,
  signature,
  tx,
}: {
  cluster: Cluster
  signature: string
  tx: TransactionData
}) {
  return (
    <div className="border text-xs space-y-5 rounded-md px-2 py-4">
      <PortfolioUiTxDetailRow
        label="View on Explorer"
        value={
          <div className="space-x-2">
            <PortfolioUiExplorerButton cluster={cluster} label="Solana" path={`/tx/${signature}`} provider="solana" />
            <PortfolioUiExplorerButton cluster={cluster} label="Solscan" path={`/tx/${signature}`} provider="solscan" />
            <PortfolioUiExplorerButton cluster={cluster} label="Orb" path={`/tx/${signature}`} provider="orb" />
          </div>
        }
      />
      <Separator />
      <PortfolioUiTxDetailRow label="Signature" value={signature} />
      <Separator />
      <div className="grid grid-cols-2 gap-y-4">
        <PortfolioUiTxDetailRow label="Status" value={getTxStatus(tx)} />
        <PortfolioUiTxDetailRow label="Cluster" value={cluster.type} />
        <PortfolioUiTxDetailRow label="Fee Payer" value={tx.transaction.message.accountKeys[0]} />
        <PortfolioUiTxDetailRow label="Timestamp" value={<PortfolioUiTxTimestamp blockTime={tx.blockTime} />} />
      </div>
      <Separator />
      <PortfolioUiTxDetailRow
        label="Raw TX"
        value={<pre className="text-[9px] overflow-auto">{JSON.stringify(tx, null, 2)}</pre>}
      />
    </div>
  )
}
