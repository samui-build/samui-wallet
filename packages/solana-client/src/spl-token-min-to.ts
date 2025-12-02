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
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction, getMintToCheckedInstruction } from '@solana-program/token-2022'
import { getLatestBlockhash, type LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenMintToOptions {
  amount: bigint
  feePayer: KeyPairSigner
  latestBlockhash?: LatestBlockhash | undefined
  tokenProgram?: Address
  mint: Address
  decimals: number
}

export interface SplTokenMintToResult {
  ata: Address
  signature: Signature
}

export async function splTokenMintTo(
  client: SolanaClient,
  { amount, feePayer, latestBlockhash, mint, decimals, tokenProgram = TOKEN_PROGRAM_ADDRESS }: SplTokenMintToOptions,
): Promise<SplTokenMintToResult> {
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

  const mintToInstruction = getMintToCheckedInstruction(
    {
      amount,
      decimals,
      mint,
      mintAuthority: feePayer,
      token: ata,
    },
    { programAddress: tokenProgram },
  )

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
