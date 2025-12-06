import type { Address, Instruction, TransactionSigner } from '@solana/kit'
import { assertIsAddress, assertIsKeyPairSigner } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'

export interface CreateSolTransferTransactionOptions {
  amount: bigint
  destination: Address
  sender: TransactionSigner
  source?: TransactionSigner
}

export function createSolTransferInstructions({
  amount,
  destination,
  sender,
  source,
}: CreateSolTransferTransactionOptions): Instruction[] {
  assertIsAddress(destination)
  assertIsKeyPairSigner(sender)
  if (source) {
    assertIsKeyPairSigner(source)
  }
  source = source ?? sender
  const transferInstruction = getTransferSolInstruction({ amount, destination, source })

  return [transferInstruction]
}
