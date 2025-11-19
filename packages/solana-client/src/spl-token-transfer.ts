import {
  type Address,
  appendTransactionMessageInstructions,
  assertIsTransactionWithBlockhashLifetime,
  createTransactionMessage,
  getSignatureFromTransaction,
  type KeyPairSigner,
  pipe,
  type Signature,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit'
import { findAssociatedTokenPda, getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token-2022'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenTransferOptions {
  amount: bigint
  feePayer: KeyPairSigner
  latestBlockhash?: LatestBlockhash | undefined
  tokenProgram?: Address
  mint: Address
}

export interface SplTokenTransferResult {
  ata: Address
  signature: Signature
}

export async function splTokenTransfer(
  client: SolanaClient,
  { amount, feePayer, latestBlockhash, mint, tokenProgram = TOKEN_PROGRAM_ADDRESS }: SplTokenTransferOptions,
): Promise<SplTokenTransferResult> {
  const [ata] = await findAssociatedTokenPda({
    mint,
    owner: feePayer.address,
    tokenProgram,
  })

  const createAtaInstruction = getCreateAssociatedTokenIdempotentInstruction({
    ata,
    mint,
    owner: feePayer.address,
    payer: feePayer,
    tokenProgram,
  })

  const mintToInstruction = getMintToInstruction({
    amount,
    mint,
    mintAuthority: feePayer,
    token: ata,
  })

  latestBlockhash = latestBlockhash ?? (await getLatestBlockhash(client))

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(feePayer, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions([createAtaInstruction, mintToInstruction], tx),
  )

  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage)
  assertIsTransactionWithBlockhashLifetime(signedTransaction)

  await sendAndConfirmTransactionFactory({ rpc: client.rpc, rpcSubscriptions: client.rpcSubscriptions })(
    signedTransaction,
    { commitment: 'confirmed' },
  )

  const signature = getSignatureFromTransaction(signedTransaction)

  return { ata, signature }
}
