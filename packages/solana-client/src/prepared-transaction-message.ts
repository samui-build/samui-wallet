import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  type Instruction,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  type TransactionSigner,
} from '@solana/kit'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'

export interface PreparedTransactionOptions {
  instructions: Instruction[]
  latestBlockhash?: LatestBlockhash | undefined
  transactionSigner: TransactionSigner
}

export type PreparedTransaction = Omit<PreparedTransactionOptions, 'latestBlockhash'>

export async function createPreparedTransactionMessage(
  client: SolanaClient,
  { instructions, latestBlockhash, transactionSigner }: PreparedTransactionOptions,
) {
  const transactionLatestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
    (tx) => setTransactionMessageFeePayerSigner(transactionSigner, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(transactionLatestBlockhash, tx),
  )

  return {
    latestBlockhash: transactionLatestBlockhash,
    transactionMessage,
  }
}
