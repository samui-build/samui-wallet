import type { Address, Instruction, KeyPairSigner } from '@solana/kit'
import { getMintToInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token-2022'

export interface SplTokenTransferInstructionsOptions {
  amount: bigint
  ata: Address
  feePayerSigner: KeyPairSigner
  tokenProgram?: Address
  mint: Address
}

export function splTokenTransferInstructions({
  amount,
  ata,
  feePayerSigner,
  mint,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: SplTokenTransferInstructionsOptions): Instruction[] {
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

  return [createAtaInstruction, mintToInstruction]
}
