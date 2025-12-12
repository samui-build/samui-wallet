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

interface CreateSplTransferTransactionOptions {
  amount: bigint
  decimals: number
  destination: Address
  mint: Address
  source?: TransactionSigner
  tokenProgram?: Address
  transactionSigner: TransactionSigner
}

export async function createSplTransferInstructions({
  amount,
  decimals,
  destination,
  transactionSigner,
  mint,
  source,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: CreateSplTransferTransactionOptions): Promise<Instruction[]> {
  assertIsAddress(destination)
  assertIsAddress(mint)
  assertIsAddress(tokenProgram)
  assertIsTransactionSigner(transactionSigner)
  if (source) {
    assertIsTransactionSigner(source)
  }
  const authority = source ?? transactionSigner

  const [[sourceATA], [destinationATA]] = await Promise.all([
    findAssociatedTokenPda({
      mint,
      owner: transactionSigner.address,
      tokenProgram,
    }),
    findAssociatedTokenPda({
      mint,
      owner: destination,
      tokenProgram,
    }),
  ])

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

  return [createAtaInstruction, transferInstruction]
}
