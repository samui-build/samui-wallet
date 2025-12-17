import { assertIsAddress, assertIsTransactionSigner, type Instruction, type TransactionSigner } from '@solana/kit'
import { getTransferSolInstruction } from '@solana-program/system'
import type { TransferRecipient } from './transfer-recipient.ts'

export interface CreateSolTransferTransactionOptions {
  recipients: TransferRecipient[]
  source: TransactionSigner
}

export function createSolTransferInstructions({
  recipients,
  source,
}: CreateSolTransferTransactionOptions): Instruction[] {
  for (const { destination } of recipients) {
    assertIsAddress(destination)
  }
  assertIsTransactionSigner(source)

  return recipients.map(({ amount, destination }) => getTransferSolInstruction({ amount, destination, source }))
}
