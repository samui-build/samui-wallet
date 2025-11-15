import type { Network } from '@workspace/db/entity/network'
import { Separator } from '@workspace/ui/components/separator'
import type { ExplorerGetTransactionResult } from '../data-access/use-explorer-get-transaction.ts'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiExplorers } from './explorer-ui-explorers.tsx'
import { ExplorerUiTxTimestamp } from './explorer-ui-tx-timestamp.tsx'

function getTxStatus(tx: ExplorerGetTransactionResult) {
  // @ts-expect-error figure out how to properly type the 'Ok' property.
  return tx?.meta?.status?.Ok !== undefined ? 'Confirmed' : 'Rejected'
}

export function ExplorerUiTxDetails({
  network,
  signature,
  tx,
}: {
  network: Network
  signature: string
  tx: ExplorerGetTransactionResult
}) {
  if (!tx) {
    return null
  }
  return (
    <div className="text-xs space-y-4">
      <ExplorerUiDetailRow
        label="View on Explorer"
        value={<ExplorerUiExplorers network={network} path={`/tx/${signature}`} />}
      />
      <Separator />
      <ExplorerUiDetailRow label="Signature" value={signature} />
      <Separator />
      <div className="grid grid-cols-2 gap-y-4">
        <ExplorerUiDetailRow label="Status" value={getTxStatus(tx)} />
        <ExplorerUiDetailRow label="Network" value={network.type} />
        <ExplorerUiDetailRow label="Fee Payer" value={tx.transaction.message.accountKeys[0]} />
        <ExplorerUiDetailRow label="Timestamp" value={<ExplorerUiTxTimestamp blockTime={tx.blockTime} />} />
      </div>
      <Separator />
      <ExplorerUiDetailRow
        label="Raw TX"
        value={<pre className="text-[9px] overflow-auto">{JSON.stringify(tx, null, 2)}</pre>}
      />
    </div>
  )
}
