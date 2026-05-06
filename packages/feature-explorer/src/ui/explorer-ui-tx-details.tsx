import type { Signature } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import type { GetTransactionResult } from '@workspace/solana-client/get-transaction'
import { Separator } from '@workspace/ui/components/separator'
import { UiDebug } from '@workspace/ui/components/ui-debug'
import { UiPre } from '@workspace/ui/components/ui-pre'
import { ExplorerUiDetailGrid } from './explorer-ui-detail-grid.tsx'
import { ExplorerUiDetailRow } from './explorer-ui-detail-row.tsx'
import { ExplorerUiLinkAddress } from './explorer-ui-link-address.tsx'
import { ExplorerUiLinkSignature } from './explorer-ui-link-signature.tsx'
import { ExplorerUiTxAccounts } from './explorer-ui-tx-accounts.tsx'
import { ExplorerUiTxInstructions } from './explorer-ui-tx-instructions.tsx'
import { ExplorerUiTxTimestamp } from './explorer-ui-tx-timestamp.tsx'
import { ExplorerUiTxTokenBalances } from './explorer-ui-tx-token-balances.tsx'

function getTxStatus(tx: GetTransactionResult) {
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
  tx: GetTransactionResult
}) {
  if (!tx) {
    return null
  }
  const feePayer = tx.transaction.message.accountKeys[0]?.pubkey
  return (
    <ExplorerUiDetailGrid>
      <ExplorerUiDetailRow
        label="Signature"
        value={<ExplorerUiLinkSignature basePath={basePath} signature={signature} />}
        variant="wide"
      />
      <ExplorerUiDetailRow label="Status" value={getTxStatus(tx)} variant="wide" />
      <ExplorerUiDetailRow label="Network" value={network.type} variant="wide" />
      <ExplorerUiDetailRow
        label="Fee Payer"
        value={feePayer ? <ExplorerUiLinkAddress address={feePayer} basePath={basePath} /> : <div />}
        variant="wide"
      />
      <ExplorerUiDetailRow
        label="Timestamp"
        value={<ExplorerUiTxTimestamp blockTime={tx.blockTime} />}
        variant="wide"
      />
      <Separator />
      <ExplorerUiTxAccounts basePath={basePath} tx={tx} />
      <ExplorerUiTxTokenBalances basePath={basePath} tx={tx} />
      <ExplorerUiTxInstructions basePath={basePath} tx={tx} />
      <Separator />
      <ExplorerUiDetailRow label="Program Instruction Logs" value={<UiDebug data={tx.meta?.logMessages ?? []} />} />
      <Separator />
      {tx.meta?.logMessages?.length ? (
        <>
          <ExplorerUiDetailRow label="Log messages" value={<UiPre>{tx.meta.logMessages.join('\n')}</UiPre>} />
          <Separator />
        </>
      ) : null}
      {tx.transaction.message.instructions?.length ? (
        <>
          <ExplorerUiDetailRow label="Instructions" value={<UiDebug data={tx.transaction.message.instructions} />} />
          <Separator />
        </>
      ) : null}
      <ExplorerUiDetailRow label="Raw TX" value={<UiDebug data={tx} />} />
    </ExplorerUiDetailGrid>
  )
}
