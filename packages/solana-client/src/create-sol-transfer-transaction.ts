import type { Address, Blockhash, TransactionSigner } from '@solana/kit'
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

export interface LatestBlockhash {
  blockhash: Blockhash
  lastValidBlockHeight: bigint
}

export function createSolTransferTransaction({
  amount,
  destination,
  latestBlockhash,
  sender,
  source,
}: {
  amount: bigint
  destination: Address | string
  latestBlockhash: LatestBlockhash
  sender: TransactionSigner
  source?: TransactionSigner
}) {
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
