import type { Network } from '@workspace/db/entity/network'
import type { TransactionData } from '@workspace/solana-client-react/use-get-transaction'

import { Separator } from '@workspace/ui/components/separator'

import { getTxStatus } from './get-tx-status.tsx'
import { PortfolioUiTxDetailRow } from './portfolio-ui-tx-detail-row.tsx'
import { PortfolioUiExplorerButton } from './ui/portfolio-ui-explorer-button.tsx'
import { PortfolioUiTxTimestamp } from './ui/portfolio-ui-tx-timestamp.tsx'

export function PortfolioUiTxDetails({
  network,
  signature,
  tx,
}: {
  network: Network
  signature: string
  tx: TransactionData
}) {
  return (
    <div className="border text-xs space-y-5 rounded-md px-2 py-4">
      <PortfolioUiTxDetailRow
        label="View on Explorer"
        value={
          <div className="space-x-2">
            <PortfolioUiExplorerButton label="Solana" network={network} path={`/tx/${signature}`} provider="solana" />
            <PortfolioUiExplorerButton label="Solscan" network={network} path={`/tx/${signature}`} provider="solscan" />
            <PortfolioUiExplorerButton label="Orb" network={network} path={`/tx/${signature}`} provider="orb" />
          </div>
        }
      />
      <Separator />
      <PortfolioUiTxDetailRow label="Signature" value={signature} />
      <Separator />
      <div className="grid grid-cols-2 gap-y-4">
        <PortfolioUiTxDetailRow label="Status" value={getTxStatus(tx)} />
        <PortfolioUiTxDetailRow label="Network" value={network.type} />
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
