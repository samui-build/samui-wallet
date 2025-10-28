import type { ExtensionType } from '@solana-program/token-2022'
import type { Address, Blockhash, Instruction, TransactionSigner } from '@solana/kit'

import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import {
  getCreateAssociatedTokenInstruction,
  getReallocateInstruction,
  getTransferCheckedInstruction,
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
  destinationTokenAccountExists = false,
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

  const ixs: Instruction[] = []
  if (!destinationTokenAccountExists) {
    // Create associated token account instruction for TOKEN_PROGRAM_ADDRESS
    if (tokenProgram === TOKEN_PROGRAM_ADDRESS) {
      ixs.push(
        getCreateAssociatedTokenInstruction({
          ata: address(destinationTokenAccount),
          mint: address(mint),
          owner: address(destination),
          payer: sender,
          tokenProgram: address(tokenProgram),
        }),
      )
    } else {
      ixs.push(
        getCreateAssociatedTokenInstruction({
          ata: address(destinationTokenAccount),
          mint: address(mint),
          owner: address(destination),
          payer: sender,
          tokenProgram: address(tokenProgram),
        }),
      )
      if (tokenAccountExtensions.length > 0) {
        ixs.push(
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

  ixs.push(transferInstruction)

  return pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(sender, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(ixs, tx),
  )
}
