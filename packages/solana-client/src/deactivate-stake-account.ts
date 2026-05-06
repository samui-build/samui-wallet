import type { Address, Signature, TransactionSigner } from '@solana/kit'
import { getDeactivateInstruction } from '@solana-program/stake'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { sendPreparedTransaction } from './send-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface DeactivateStakeAccountOptions {
  latestBlockhash?: LatestBlockhash | undefined
  stake: Address
  transactionSigner: TransactionSigner
}

export async function deactivateStakeAccount(
  client: SolanaClient,
  { latestBlockhash, stake, transactionSigner }: DeactivateStakeAccountOptions,
): Promise<Signature> {
  return tryCatchOrThrow(
    sendPreparedTransaction(client, {
      instructions: [
        getDeactivateInstruction({
          stake,
          stakeAuthority: transactionSigner,
        }),
      ],
      latestBlockhash,
      transactionSigner,
    }),
    'Error deactivating stake account',
  )
}
