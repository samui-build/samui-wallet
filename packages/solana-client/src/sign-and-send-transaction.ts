import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  type KeyPairSigner,
  pipe,
  type Signature,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SignAndSendTransaction {
  latestBlockhash?: LatestBlockhash | undefined
  sender: KeyPairSigner
  instructions: Instruction[]
}

export async function signAndSendTransaction(
  client: SolanaClient,
  { latestBlockhash, sender, instructions }: SignAndSendTransaction,
): Promise<Signature> {
  // Use provided latestBlockhash or get one
  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))

  const transactionMessage = pipe(
    // Create a new transaction
    createTransactionMessage({ version: 0 }),
    // Append the instructions
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  )

  const transactionMessageWithFeePayerAndBlockhash = pipe(
    // Sign the message
    setTransactionMessageFeePayerSigner(sender, transactionMessage),
    // Add the latest blockhash
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
  )

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessageWithFeePayerAndBlockhash)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )
  return getSignatureFromTransaction(signedTransaction)
}
