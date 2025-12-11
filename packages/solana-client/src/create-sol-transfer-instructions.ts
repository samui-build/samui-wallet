import {
  type Address,
  assertIsAddress,
  assertIsTransactionSigner,
  type Instruction,
  type TransactionSigner,
} from '@solana/kit'
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
  assertIsTransactionSigner(source)

  const transferInstruction = getTransferSolInstruction({ amount, destination, source })

  return [transferInstruction]
}
