import type { TransactionSigner } from '@solana/kit'

export type GetTransactionSigner = () => Promise<TransactionSigner>
