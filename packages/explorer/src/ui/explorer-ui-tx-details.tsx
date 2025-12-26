import type { Signature } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { Separator } from '@workspace/ui/components/separator'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import type { ExplorerGetTransactionResult } from '../data-access/use-explorer-get-transaction.ts'
import { ExplorerUiDetailGrid } from './explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiDetailRowWide } from './explorer-ui-detail-row-wide.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiLinkSignature } from './explorer-ui-link-signature.tsx'
import { ExplorerUiTxAccounts } from './explorer-ui-tx-accounts.tsx'
import { ExplorerUiTxInstructions } from './explorer-ui-tx-instructions.tsx'
import { ExplorerUiTxTimestamp } from './explorer-ui-tx-timestamp.tsx'
import { ExplorerUiTxTokenBalances } from './explorer-ui-tx-token-balances.tsx'

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
  signature: Signature
  tx: ExplorerGetTransactionResult
}) {
  if (!tx) {
    return null
  }
  const feePayer = tx.transaction.message.accountKeys[0]
  return (
    <ExplorerUiDetailGrid>
      <ExplorerUiDetailRowWide
        label="Signature"
        value={<ExplorerUiLinkSignature basePath={basePath} signature={signature} />}
      />
      <ExplorerUiDetailRowWide label="Status" value={getTxStatus(tx)} />
      <ExplorerUiDetailRowWide label="Network" value={network.type} />
      <ExplorerUiDetailRowWide
        label="Fee Payer"
        value={feePayer ? <ExplorerUiLinkAddress address={feePayer.pubkey} basePath={basePath} /> : <div />}
      />
      <ExplorerUiDetailRowWide label="Timestamp" value={<ExplorerUiTxTimestamp blockTime={tx.blockTime} />} />
      <Separator />
      <ExplorerUiTxAccounts basePath={basePath} tx={tx} />
      <ExplorerUiTxTokenBalances basePath={basePath} tx={tx} />
      <ExplorerUiTxInstructions basePath={basePath} tx={tx} />
      <Separator />
      <ExplorerUiDetailRow label="Program Instruction Logs" value={<UiDebug data={tx.meta?.logMessages ?? []} />} />
      <Separator />
      <ExplorerUiDetailRow label="Raw TX" value={<UiDebug data={tx} />} />
    </ExplorerUiDetailGrid>
  )
}
