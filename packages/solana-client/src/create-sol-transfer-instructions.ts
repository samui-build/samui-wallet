import type { Address, Instruction, TransactionSigner } from '@solana/kit'
import { assertIsAddress, assertIsKeyPairSigner } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'

export interface CreateSolTransferTransactionOptions {
  amount: bigint
  destination: Address
  source: TransactionSigner
}

export function createSolTransferInstructions({
  amount,
  destination,
  source,
}: CreateSolTransferTransactionOptions): Instruction[] {
  assertIsAddress(destination)
  assertIsKeyPairSigner(source)

  const transferInstruction = getTransferSolInstruction({ amount, destination, source })

  return [transferInstruction]
}
