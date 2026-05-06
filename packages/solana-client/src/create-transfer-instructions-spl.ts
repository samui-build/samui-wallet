import {
  type Address,
  assertIsAddress,
  assertIsTransactionSigner,
  type Instruction,
  type TransactionSigner,
} from '@solana/kit'
import { findAssociatedTokenPda, getTransferCheckedInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { createGetOrCreateAtaInstruction } from './create-get-or-create-ata-instruction.ts'
import type { TransferRecipient } from './transfer-recipient.ts'

interface CreateTransferInstructionsSplOptions {
  decimals: number
  mint: Address
  recipients: TransferRecipient[]
  source?: TransactionSigner
  tokenProgram?: Address
  transactionSigner: TransactionSigner
}

export async function createTransferInstructionsSpl({
  decimals,
  transactionSigner,
  mint,
  recipients,
  source,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: CreateTransferInstructionsSplOptions): Promise<Instruction[]> {
  for (const { destination } of recipients) {
    assertIsAddress(destination)
  }
  assertIsAddress(mint)
  assertIsAddress(tokenProgram)
  assertIsTransactionSigner(transactionSigner)
  if (source) {
    assertIsTransactionSigner(source)
  }
  const authority = source ?? transactionSigner

  const [sourceATA] = await findAssociatedTokenPda({
    mint,
    owner: transactionSigner.address,
    tokenProgram,
  })

  const results: Instruction[] = []

  for (const { amount, destination } of recipients) {
    assertIsAddress(destination)

    const [destinationATA, createAtaInstruction] = await createGetOrCreateAtaInstruction({
      mint,
      owner: destination,
      tokenProgram,
      transactionSigner,
    })

    const transferInstruction = getTransferCheckedInstruction(
      {
        amount,
        authority,
        decimals,
        destination: destinationATA,
        mint,
        source: sourceATA,
      },
      { programAddress: tokenProgram },
    )

    results.push(createAtaInstruction, transferInstruction)
  }

  return results
}
