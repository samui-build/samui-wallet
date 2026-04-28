import type { Signature } from '@solana/kit'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { type PrepareTransactionSolOptions, prepareTransactionSol } from './prepare-transaction-sol.ts'
import { sendPreparedTransaction } from './send-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CreateAndSendTransactionSolOptions extends PrepareTransactionSolOptions {
  latestBlockhash?: LatestBlockhash | undefined
}

export async function createAndSendTransactionSol(
  client: SolanaClient,
  { latestBlockhash, ...options }: CreateAndSendTransactionSolOptions,
): Promise<Signature> {
  const preparedTransaction = prepareTransactionSol(options)

  return sendPreparedTransaction(client, { ...preparedTransaction, latestBlockhash })
}
