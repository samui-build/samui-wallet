import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  pipe,
  type Signature,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
  type TransactionSigner,
} from '@solana/kit'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SignAndSendTransaction {
  instructions: Instruction[]
  latestBlockhash?: LatestBlockhash | undefined
  transactionSigner: TransactionSigner
}

export async function signAndSendTransaction(
  client: SolanaClient,
  { instructions, latestBlockhash, transactionSigner }: SignAndSendTransaction,
): Promise<Signature> {
  // Use provided latestBlockhash or get one
  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
    (tx) => setTransactionMessageFeePayerSigner(transactionSigner, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  )

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
