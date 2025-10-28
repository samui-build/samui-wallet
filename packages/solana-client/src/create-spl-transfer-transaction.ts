import type { ExtensionType } from '@solana-program/token-2022'
import type { Address, Blockhash, Instruction, TransactionSigner } from '@solana/kit'

import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import {
  getCreateAssociatedTokenInstruction,
  getReallocateInstruction,
  getTransferCheckedInstruction,
  TOKEN_2022_PROGRAM_ADDRESS,
} from '@solana-program/token-2022'
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

export interface LatestBlockhash {
  blockhash: Blockhash
  lastValidBlockHeight: bigint
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
  tokenAccountExtensions,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: {
  amount: string
  decimals: number
  destination: Address | string
  destinationTokenAccount: Address | string
  destinationTokenAccountExists?: boolean
  latestBlockhash: LatestBlockhash
  mint: Address | string
  sender: TransactionSigner
  source?: TransactionSigner
  sourceTokenAccount: Address | string
  tokenAccountExtensions: ExtensionType[]
  tokenProgram?: Address | string
}) {
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
    if (tokenProgram === TOKEN_2022_PROGRAM_ADDRESS) {
      if (tokenAccountExtensions.length > 0) {
        instructions.push(
          getReallocateInstruction(
            {
              newExtensionTypes: tokenAccountExtensions,
              owner: address(sender.address),
              payer: sender,
              token: address(sourceTokenAccount),
            },
            {
              programAddress: address(tokenProgram),
            },
          ),
        )
      }
    }
  }

  const transferInstruction = getTransferCheckedInstruction(
    {
      amount: BigInt(amount),
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
