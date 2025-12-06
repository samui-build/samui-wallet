import type { Network } from '@workspace/db/network/network'
import { Separator } from '@workspace/ui/components/separator'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import type { ExplorerGetTransactionResult } from '../data-access/use-explorer-get-transaction.ts'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiExplorers } from './explorer-ui-explorers.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiTxTimestamp } from './explorer-ui-tx-timestamp.tsx'

function getTxStatus(tx: ExplorerGetTransactionResult) {
  // @ts-expect-error figure out how to properly type the 'Ok' property.
  return tx?.meta?.status?.Ok !== undefined ? 'Confirmed' : 'Rejected'
}

export function ExplorerUiTxDetails({
  basePath,
  network,
  signature,
  tx,
}: {
  basePath: string
  network: Network
  signature: string
  tx: ExplorerGetTransactionResult
}) {
  if (!tx) {
    return null
  }
  const feePayer = tx.transaction.message.accountKeys[0]
  return (
    <div className="space-y-4 text-xs">
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
        <ExplorerUiDetailRow
          label="Fee Payer"
          value={feePayer ? <ExplorerUiLinkAddress address={feePayer} basePath={basePath} /> : <div />}
        />
        <ExplorerUiDetailRow label="Timestamp" value={<ExplorerUiTxTimestamp blockTime={tx.blockTime} />} />
      </div>
      <Separator />
      <ExplorerUiDetailRow label="Raw TX" value={<UiDebug data={tx} />} />
    </div>
  )
}
