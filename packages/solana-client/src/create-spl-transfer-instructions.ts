import {
  type Address,
  assertIsAddress,
  assertIsTransactionSigner,
  type Instruction,
  type TransactionSigner,
} from '@solana/kit'
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'
import type { TransferRecipient } from './transfer-recipient.ts'

interface CreateSplTransferTransactionOptions {
  decimals: number
  mint: Address
  recipients: TransferRecipient[]
  source?: TransactionSigner
  tokenProgram?: Address
  transactionSigner: TransactionSigner
}

export async function createSplTransferInstructions({
  decimals,
  transactionSigner,
  mint,
  recipients,
  source,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: CreateSplTransferTransactionOptions): Promise<Instruction[]> {
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

    const [destinationATA] = await findAssociatedTokenPda({
      mint,
      owner: destination,
      tokenProgram,
    })

    const createAtaInstruction = getCreateAssociatedTokenIdempotentInstruction({
      ata: destinationATA,
      mint,
      owner: destination,
      payer: transactionSigner,
      tokenProgram,
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
