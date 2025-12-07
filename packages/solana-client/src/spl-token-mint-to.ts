import type { Address, KeyPairSigner, Signature } from '@solana/kit'
import { findAssociatedTokenPda, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction, getMintToCheckedInstruction } from '@solana-program/token-2022'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenMintToOptions {
  amount: bigint
  feePayerSigner: KeyPairSigner
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
  {
    amount,
    feePayerSigner,
    latestBlockhash,
    mint,
    decimals,
    tokenProgram = TOKEN_PROGRAM_ADDRESS,
  }: SplTokenMintToOptions,
): Promise<SplTokenMintToResult> {
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

  const mintToInstruction = getMintToCheckedInstruction(
    {
      amount,
      decimals,
      mint,
      mintAuthority: feePayerSigner,
      token: ata,
    },
    { programAddress: tokenProgram },
  )

  const signature = await signAndSendTransaction(client, {
    feePayerSigner,
    instructions: [createAtaInstruction, mintToInstruction],
    latestBlockhash,
  })

  return { ata, signature }
}
