import type { Signature, TransactionSigner } from '@solana/kit'
import { createSolTransferInstructions } from './create-sol-transfer-instructions.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import type { TransferRecipient } from './transfer-recipient.ts'

export interface CreateAndSendSolTransactionOptions {
  latestBlockhash?: LatestBlockhash | undefined
  recipients: TransferRecipient[]
  senderBalance: bigint
  transactionSigner: TransactionSigner
}

export async function createAndSendSolTransaction(
  client: SolanaClient,
  { latestBlockhash, recipients, senderBalance, transactionSigner }: CreateAndSendSolTransactionOptions,
): Promise<Signature> {
  const amount = recipients.reduce((acc, { amount }) => acc + amount, BigInt(0))
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  return signAndSendTransaction(client, {
    instructions: createSolTransferInstructions({ recipients, source: transactionSigner }),
    latestBlockhash,
    transactionSigner,
  })
}
