import type { KeyPairSigner } from '@solana/kit'

import {
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from '@solana/kit'

import type { SolanaClient } from './solana-client'

import { createSolTransferTransaction } from './create-sol-transfer-transaction'
import { lamportsToSol } from './lamports-to-sol'
import { maxAvailableSolAmount } from './max-available-sol-amount'

export async function createAndSendSolTransaction(
  client: SolanaClient,
  {
    amount,
    destination,
    sender,
    senderBalance,
  }: {
    amount: string
    destination: string
    sender: KeyPairSigner
    senderBalance: string
  },
): Promise<string> {
  const amountBigInt = BigInt(amount)
  const senderBalanceBigInt = BigInt(senderBalance)

  const maxAvailable = maxAvailableSolAmount(senderBalanceBigInt, amountBigInt)

  if (amountBigInt > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalanceBigInt)} SOL, Requested: ${lamportsToSol(amountBigInt)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
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
  // @ts-expect-error rpc clients are scoped to their cluster, we need to figure out how to handle this
  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    // @ts-expect-error TODO: Figure out "Property lastValidBlockHeight is missing in type TransactionDurableNonceLifetime but required in type"
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
