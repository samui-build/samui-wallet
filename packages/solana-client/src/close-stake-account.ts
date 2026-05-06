import type { Address, Lamports, Signature, TransactionSigner } from '@solana/kit'
import { getWithdrawInstruction } from '@solana-program/stake'
import { tryCatchOrThrow } from '@workspace/core/try-catch-or-throw'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { sendPreparedTransaction } from './send-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface CloseStakeAccountOptions {
  amount: Lamports
  latestBlockhash?: LatestBlockhash | undefined
  recipient: Address
  stake: Address
  transactionSigner: TransactionSigner
}

export async function closeStakeAccount(
  client: SolanaClient,
  { amount, latestBlockhash, recipient, stake, transactionSigner }: CloseStakeAccountOptions,
): Promise<Signature> {
  return tryCatchOrThrow(
    sendPreparedTransaction(client, {
      instructions: [
        getWithdrawInstruction({
          args: amount,
          recipient,
          stake,
          withdrawAuthority: transactionSigner,
        }),
      ],
      latestBlockhash,
      transactionSigner,
    }),
    'Error closing stake account',
  )
}
