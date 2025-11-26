import type { Address, Instruction, TransactionSigner } from '@solana/kit'
import {
  address,
  appendTransactionMessageInstructions,
  assertIsAddress,
  assertIsKeyPairSigner,
  createTransactionMessage,
  pipe,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/kit'
import {
  getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'
import type { LatestBlockhash } from './get-latest-blockhash.ts'

interface CreateSplTransferTransactionOptions {
  amount: bigint
  decimals: number
  destination: Address | string
  destinationTokenAccount: Address | string
  destinationTokenAccountExists?: boolean
  latestBlockhash: LatestBlockhash
  mint: Address | string
  sender: TransactionSigner
  source?: TransactionSigner
  sourceTokenAccount: Address | string
  tokenProgram?: Address | string
}

export function createSplTransferTransaction({
  amount,
  decimals,
  destination,
  destinationTokenAccount,
  destinationTokenAccountExists,
  latestBlockhash,
  mint,
  sender,
  source,
  sourceTokenAccount,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: CreateSplTransferTransactionOptions) {
  assertIsAddress(mint)
  assertIsAddress(sourceTokenAccount)
  assertIsAddress(destinationTokenAccount)
  assertIsAddress(destination)
  assertIsKeyPairSigner(sender)
  if (source) {
    assertIsKeyPairSigner(source)
  }

  const instructions: Instruction[] = []
  if (!destinationTokenAccountExists) {
    instructions.push(
      getCreateAssociatedTokenInstruction({
        ata: address(destinationTokenAccount),
        mint: address(mint),
        owner: address(destination),
        payer: sender,
        tokenProgram: address(tokenProgram),
      }),
    )
  }

  const transferInstruction = getTransferCheckedInstruction(
    {
      amount,
      authority: source ?? sender,
      decimals,
      destination: address(destinationTokenAccount),
      mint: address(mint),
      source: address(sourceTokenAccount),
    },
    {
      programAddress: address(tokenProgram),
    },
  )

  instructions.push(transferInstruction)

  return pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(sender, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  )
}
