import type { Address, Signature, TransactionSigner } from '@solana/kit'
import { createSolTransferInstructions } from './create-sol-transfer-instructions.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CreateAndSendSolTransactionOptions {
  amount: bigint
  destination: Address
  latestBlockhash?: LatestBlockhash | undefined
  senderBalance: bigint
  transactionSigner: TransactionSigner
}

export async function createAndSendSolTransaction(
  client: SolanaClient,
  { amount, destination, latestBlockhash, senderBalance, transactionSigner }: CreateAndSendSolTransactionOptions,
): Promise<Signature> {
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  return signAndSendTransaction(client, {
    instructions: createSolTransferInstructions({ amount, destination, source: transactionSigner }),
    latestBlockhash,
    transactionSigner,
  })
}
