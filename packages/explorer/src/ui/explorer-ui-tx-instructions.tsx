import type { GetTransactionResult } from '@workspace/solana-client/get-transaction'
import { ExplorerUiTxInstructionsItem } from './explorer-ui-tx-instructions-item.tsx'

export function ExplorerUiTxInstructions({ basePath, tx }: { basePath: string; tx: GetTransactionResult }) {
  const instructions = tx.transaction.message.instructions ?? []
  if (!instructions?.length) {
    return null
  }
  return (
    <div className="space-y-2 md:space-y-6">
      {instructions.map((instruction, index) => (
        <ExplorerUiTxInstructionsItem
          basePath={basePath}
          index={index}
          instruction={instruction}
          key={`${index.toString()}1`}
          meta={tx.meta}
        />
      ))}
    </div>
  )
}
