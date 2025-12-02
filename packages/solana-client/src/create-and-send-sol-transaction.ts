import {
  assertIsTransactionWithBlockhashLifetime,
  getSignatureFromTransaction,
  type KeyPairSigner,
  type Signature,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { createSolTransferTransaction } from './create-sol-transfer-transaction.ts'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CreateAndSendSolTransactionOptions {
  amount: bigint
  destination: string
  latestBlockhash?: LatestBlockhash | undefined
  sender: KeyPairSigner
  senderBalance: bigint
}

export async function createAndSendSolTransaction(
  client: SolanaClient,
  { amount, destination, latestBlockhash, sender, senderBalance }: CreateAndSendSolTransactionOptions,
): Promise<Signature> {
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))

  const transactionMessage = createSolTransferTransaction({
    amount,
    destination,
    latestBlockhash,
    sender,
  })

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
