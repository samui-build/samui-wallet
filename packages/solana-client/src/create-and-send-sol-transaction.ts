import type { KeyPairSigner } from '@solana/kit'

import type { SolanaClient } from './solana-client'

import { createSolTransferTransaction } from './create-sol-transfer-transaction'
import {
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from './index'
import { maxAvailableSolAmount } from './max-available-sol-amount'
import { solToLamports } from './sol-to-lamports'

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
  const maxSendable = maxAvailableSolAmount(senderBalance)
  const requestedAmount = solToLamports(amount)

  if (requestedAmount > maxSendable) {
    throw new Error('Insufficient funds. Amount exceeds available balance after transaction fees.')
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
