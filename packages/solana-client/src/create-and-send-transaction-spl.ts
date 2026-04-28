import type { Signature } from '@solana/kit'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { type PrepareTransactionSplOptions, prepareTransactionSpl } from './prepare-transaction-spl.ts'
import { sendPreparedTransaction } from './send-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CreateAndSendTransactionSplOptions extends PrepareTransactionSplOptions {
  latestBlockhash?: LatestBlockhash | undefined
}

export async function createAndSendTransactionSpl(
  client: SolanaClient,
  { latestBlockhash, ...options }: CreateAndSendTransactionSplOptions,
): Promise<Signature> {
  const preparedTransaction = await prepareTransactionSpl(client, options)

  return sendPreparedTransaction(client, { ...preparedTransaction, latestBlockhash })
}
