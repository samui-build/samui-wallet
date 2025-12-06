import type { Address, KeyPairSigner, Signature } from '@solana/kit'
import { findAssociatedTokenPda, getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token-2022'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenTransferOptions {
  amount: bigint
  feePayerSigner: KeyPairSigner
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
  { amount, feePayerSigner, latestBlockhash, mint, tokenProgram = TOKEN_PROGRAM_ADDRESS }: SplTokenTransferOptions,
): Promise<SplTokenTransferResult> {
  const [ata] = await findAssociatedTokenPda({
    mint,
    owner: feePayerSigner.address,
    tokenProgram,
  })

  const createAtaInstruction = getCreateAssociatedTokenIdempotentInstruction({
    ata,
    mint,
    owner: feePayerSigner.address,
    payer: feePayerSigner,
    tokenProgram,
  })

  const mintToInstruction = getMintToInstruction({
    amount,
    mint,
    mintAuthority: feePayerSigner,
    token: ata,
  })

  const signature = await signAndSendTransaction(client, {
    feePayerSigner,
    instructions: [createAtaInstruction, mintToInstruction],
    latestBlockhash,
  })

  return { ata, signature }
}
