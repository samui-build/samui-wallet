import type { Address, Instruction, TransactionSigner } from '@solana/kit'
import { findAssociatedTokenPda } from '@solana-program/token'
import { getCreateAssociatedTokenIdempotentInstruction } from '@solana-program/token-2022'

export async function createGetOrCreateAtaInstruction({
  mint,
  owner,
  tokenProgram,
  transactionSigner: payer,
}: {
  mint: Address
  owner: Address
  tokenProgram: Address
  transactionSigner: TransactionSigner
}): Promise<[Address, Instruction]> {
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
