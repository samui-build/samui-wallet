import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  type Instruction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  type TransactionSigner,
  type TransactionWithLifetime,
} from '@solana/kit'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CreateTransaction {
  instructions: Instruction[]
  latestBlockhash?: LatestBlockhash | undefined
  transactionSigner: TransactionSigner
}

export async function createTransaction(
  client: SolanaClient,
  { instructions, latestBlockhash, transactionSigner }: CreateTransaction,
): Promise<TransactionWithLifetime> {
  // Use provided latestBlockhash or get one
  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))

  return pipe(
    // Create a new transaction
    createTransactionMessage({ version: 0 }),
    // Sign the message
    (tx) => setTransactionMessageFeePayerSigner(transactionSigner, tx),
    // Append the instructions
    (tx) => appendTransactionMessageInstructions(instructions, tx),
    // Add the latest blockhash
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  )
}
