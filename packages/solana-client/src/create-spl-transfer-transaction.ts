import type { Address, Blockhash, Instruction, TransactionSigner } from '@solana/kit'

import {
  getCreateAssociatedTokenInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from '@solana-program/token'
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
  destinationTokenAccountIsExisted = false,
  latestBlockhash,
  mint,
  sender,
  source,
  sourceTokenAccount,
  tokenProgram = TOKEN_PROGRAM_ADDRESS,
}: {
  amount: string
  decimals: number
  destination: Address | string
  destinationTokenAccount: Address | string
  destinationTokenAccountIsExisted?: boolean
  latestBlockhash: LatestBlockhash
  mint: Address | string
  sender: TransactionSigner
  source?: TransactionSigner
  sourceTokenAccount: Address | string
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

  const ixs: Instruction[] = []
  if (!destinationTokenAccountIsExisted) {
    ixs.push(
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

  ixs.push(transferInstruction)

  return pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(sender, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(ixs, tx),
  )
}
