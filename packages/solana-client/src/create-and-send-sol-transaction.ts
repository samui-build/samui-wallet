import type { Address, KeyPairSigner, Signature } from '@solana/kit'
import { createSolTransferInstructions } from './create-sol-transfer-instructions.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { lamportsToSol } from './lamports-to-sol.ts'
import { maxAvailableSolAmount } from './max-available-sol-amount.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CreateAndSendSolTransactionOptions {
  amount: bigint
  destination: Address
  feePayerSigner: KeyPairSigner
  latestBlockhash?: LatestBlockhash | undefined
  senderBalance: bigint
}

export async function createAndSendSolTransaction(
  client: SolanaClient,
  { amount, destination, latestBlockhash, feePayerSigner, senderBalance }: CreateAndSendSolTransactionOptions,
): Promise<Signature> {
  const maxAvailable = maxAvailableSolAmount(senderBalance, amount)

  if (amount > maxAvailable) {
    throw new Error(
      `Insufficient balance. Available: ${lamportsToSol(senderBalance)} SOL, Requested: ${lamportsToSol(amount)} SOL, Max sendable (after fees): ${lamportsToSol(maxAvailable)} SOL`,
    )
  }

  return signAndSendTransaction(client, {
    feePayerSigner,
    instructions: createSolTransferInstructions({ amount, destination, source: feePayerSigner }),
    latestBlockhash,
  })
}
