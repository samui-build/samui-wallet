import {
  type Address,
  assertIsAddress,
  assertIsKeyPairSigner,
  type Instruction,
  type TransactionSigner,
} from '@solana/kit'
import {
  getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'

interface CreateSplTransferTransactionOptions {
  amount: bigint
  decimals: number
  destination: Address
  destinationTokenAccount: Address
  destinationTokenAccountExists?: boolean
  mint: Address
  sender: TransactionSigner
  source?: TransactionSigner
  sourceTokenAccount: Address
  tokenProgram?: Address
}

export function createSplTransferInstructions({
  amount,
  decimals,
  destination,
  destinationTokenAccount,
  destinationTokenAccountExists,
  mint,
  sender,
  source,
  sourceTokenAccount,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: CreateSplTransferTransactionOptions): Instruction[] {
  assertIsAddress(destination)
  assertIsAddress(destinationTokenAccount)
  assertIsAddress(mint)
  assertIsAddress(sourceTokenAccount)
  assertIsAddress(tokenProgram)
  assertIsKeyPairSigner(sender)
  if (source) {
    assertIsKeyPairSigner(source)
  }

  const instructions: Instruction[] = []
  if (!destinationTokenAccountExists) {
    instructions.push(
      getCreateAssociatedTokenInstruction({
        ata: destinationTokenAccount,
        mint,
        owner: destination,
        payer: sender,
        tokenProgram,
      }),
    )
  }

  const transferInstruction = getTransferCheckedInstruction(
    {
      amount,
      authority: source ?? sender,
      decimals,
      destination: destinationTokenAccount,
      mint: mint,
      source: sourceTokenAccount,
    },
    {
      programAddress: tokenProgram,
    },
  )

  instructions.push(transferInstruction)

  return instructions
}
