import type { Address, Signature, TransactionSigner } from '@solana/kit'
import { getBurnInstruction as getSplTokenBurnInstruction, TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import {
  getBurnInstruction as getToken2022BurnInstruction,
  type TOKEN_2022_PROGRAM_ADDRESS,
} from '@solana-program/token-2022'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { sendPreparedTransaction } from './send-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export type SplTokenBurnTokenProgram = typeof TOKEN_PROGRAM_ADDRESS | typeof TOKEN_2022_PROGRAM_ADDRESS | Address

export interface SplTokenBurnOptions {
  account: Address
  amount: bigint
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  /** Defaults to SPL Token. Pass TOKEN_2022_PROGRAM_ADDRESS for Token-2022 accounts. */
  tokenProgram?: SplTokenBurnTokenProgram
  transactionSigner: TransactionSigner
}

export interface SplTokenBurnResult {
  signature: Signature
}

export async function splTokenBurn(
  client: SolanaClient,
  {
    account,
    amount,
    latestBlockhash,
    mint,
    tokenProgram = TOKEN_PROGRAM_ADDRESS,
    transactionSigner,
  }: SplTokenBurnOptions,
): Promise<SplTokenBurnResult> {
  if (amount <= 0n) {
    throw new Error('Amount must be greater than 0')
  }

  const burnInstruction =
    tokenProgram === TOKEN_PROGRAM_ADDRESS
      ? getSplTokenBurnInstruction({ account, amount, authority: transactionSigner, mint })
      : getToken2022BurnInstruction(
          { account, amount, authority: transactionSigner, mint },
          { programAddress: tokenProgram },
        )

  const signature = await sendPreparedTransaction(client, {
    instructions: [burnInstruction],
    latestBlockhash,
    transactionSigner,
  })

  return { signature }
}
