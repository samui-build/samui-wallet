import type { Address, Instruction, TransactionSigner } from '@solana/kit'
import { findAssociatedTokenPda } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token-2022'

export interface CreateGetOrCreateAtaInstructionOptions {
  mint: Address
  owner: Address
  tokenProgram: Address
  transactionSigner: TransactionSigner
}

export type CreateGetOrCreateAtaInstructionResult = [Address, Instruction]

export async function createGetOrCreateAtaInstruction({
  mint,
  owner,
  tokenProgram,
  transactionSigner: payer,
}: CreateGetOrCreateAtaInstructionOptions): Promise<CreateGetOrCreateAtaInstructionResult> {
  const [ata] = await findAssociatedTokenPda({
    mint,
    owner,
    tokenProgram,
  })

  const ix = getCreateAssociatedTokenIdempotentInstruction({
    ata,
    mint,
    owner,
    payer,
    tokenProgram,
  })

  return [ata, ix]
}
