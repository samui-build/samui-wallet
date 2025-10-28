import type { TransactionData } from '@workspace/solana-client-react/use-get-transaction'

export function getTxStatus(tx: TransactionData) {
  return tx.meta?.status?.Ok !== undefined ? 'Confirmed' : 'Rejected'
}
