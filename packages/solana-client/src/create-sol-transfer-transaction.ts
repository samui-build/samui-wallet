import type { Address, TransactionSigner } from '@solana/kit'
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
import { getTransferSolInstruction } from '@solana-program/system'
import type { LatestBlockhash } from './get-latest-blockhash.ts'

export interface CreateSolTransferTransactionOptions {
  amount: bigint
  destination: Address | string
  latestBlockhash: LatestBlockhash
  sender: TransactionSigner
  source?: TransactionSigner
}

export function createSolTransferTransaction({
  amount,
  destination,
  latestBlockhash,
  sender,
  source,
}: CreateSolTransferTransactionOptions) {
  assertIsAddress(destination)
  assertIsKeyPairSigner(sender)
  if (source) {
    assertIsKeyPairSigner(source)
  }
  const transferInstruction = getTransferSolInstruction({
    amount,
    destination: address(destination),
    source: source ?? sender,
  })

  return pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayerSigner(sender, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions([transferInstruction], tx),
  )
}
