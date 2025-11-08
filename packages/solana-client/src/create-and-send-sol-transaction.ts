import type { KeyPairSigner } from '@solana/kit'
import {
  getSignatureFromTransaction,
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
  // @ts-expect-error rpc clients are scoped to their network, we need to figure out how to handle this
  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    // @ts-expect-error TODO: Figure out "Property lastValidBlockHeight is missing in type TransactionDurableNonceLifetime but required in type"
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
