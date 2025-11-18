import {
  assertIsTransactionWithBlockhashLifetime,
  getSignatureFromTransaction,
  type KeyPairSigner,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { createSolTransferTransaction } from './create-sol-transfer-transaction.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import type { SolanaClient } from './solana-client.ts'

export async function createAndSendSolTransaction(
  client: SolanaClient,
  {
    amount,
    destination,
    sender,
    senderBalance,
  }: {
    amount: bigint
    destination: string
    sender: KeyPairSigner
    senderBalance: bigint
  },
): Promise<string> {
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  const { value: latestBlockhash } = await client.rpc.getLatestBlockhash().send()
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
