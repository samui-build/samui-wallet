import type { KeyPairSigner } from '@solana/kit'

import type { SolanaClient } from './solana-client'

import { createSolTransferTransaction } from './create-sol-transfer-transaction'
import {
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  signTransactionMessageWithSigners,
} from './index'

export async function createAndSendSolTransaction(
  client: SolanaClient,
  {
    amount,
    destination,
    sender,
  }: {
    amount: string
    destination: string
    sender: KeyPairSigner
  },
): Promise<string> {
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
