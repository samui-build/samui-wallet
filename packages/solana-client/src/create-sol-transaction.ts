import type { TransactionSigner } from '@solana/kit'
import { createSolTransferInstructions } from './create-sol-transfer-instructions.ts'
import { createTransaction } from './create-transaction.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import type { SolanaClient } from './solana-client.ts'
import type { TransferRecipient } from './transfer-recipient.ts'

export interface CreateSolTransactionOptions {
  latestBlockhash?: LatestBlockhash | undefined
  recipients: TransferRecipient[]
  senderBalance: bigint
  transactionSigner: TransactionSigner
}

export async function createSolTransaction(
  client: SolanaClient,
  { latestBlockhash, recipients, senderBalance, transactionSigner }: CreateSolTransactionOptions,
) {
  const amount = recipients.reduce((acc, { amount }) => acc + amount, BigInt(0))
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  return createTransaction(client, {
    instructions: createSolTransferInstructions({ recipients, source: transactionSigner }),
    latestBlockhash,
    transactionSigner,
  })
}
