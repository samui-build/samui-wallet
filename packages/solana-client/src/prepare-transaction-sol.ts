import type { TransactionSigner } from '@solana/kit'
import { createTransferInstructionsSol } from './create-transfer-instructions-sol.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import type { PreparedTransaction } from './send-prepared-transaction.ts'
import type { TransferRecipient } from './transfer-recipient.ts'

export interface PrepareTransactionSolOptions {
  recipients: TransferRecipient[]
  senderBalance: bigint
  transactionSigner: TransactionSigner
}

export function prepareTransactionSol({
  recipients,
  senderBalance,
  transactionSigner,
}: PrepareTransactionSolOptions): PreparedTransaction {
  assertValidRecipients(recipients)

  const amount = recipients.reduce((acc, { amount }) => acc + amount, BigInt(0))
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  return {
    instructions: createTransferInstructionsSol({ recipients, source: transactionSigner }),
    transactionSigner,
  }
}

function assertValidRecipients(recipients: TransferRecipient[]) {
  if (!recipients.length) {
    throw new Error('At least one recipient is required')
  }

  for (const [index, { amount, destination }] of recipients.entries()) {
    if (amount <= 0n) {
      throw new Error(
        `Recipient ${index + 1} amount must be greater than 0 SOL. Destination: ${destination}, Requested: ${lamportsToSol(amount)} SOL`,
      )
    }
  }
}
