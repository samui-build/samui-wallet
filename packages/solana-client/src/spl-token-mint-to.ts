import type { Address, KeyPairSigner, Signature } from '@solana/kit'
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction, getMintToCheckedInstruction } from '@solana-program/token-2022'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
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

  const signature = await signAndSendTransaction(client, {
    instructions: [createAtaInstruction, mintToInstruction],
    latestBlockhash,
    sender: feePayer,
  })

  return { ata, signature }
}
