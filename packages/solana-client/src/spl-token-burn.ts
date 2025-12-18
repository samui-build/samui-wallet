import type { Address, Signature, TransactionSigner } from '@solana/kit'
import { TOKEN_PROGRAM_ADDRESS } from '@solana-program/token'
import { getBurnInstruction, type TOKEN_2022_PROGRAM_ADDRESS } from '@solana-program/token-2022'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'

export interface SplTokenBurnOptions {
  account: Address
  amount: bigint
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  tokenProgram?: typeof TOKEN_PROGRAM_ADDRESS | typeof TOKEN_2022_PROGRAM_ADDRESS | Address
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
  const burnInstruction = getBurnInstruction(
    { account, amount, authority: transactionSigner, mint },
    { programAddress: tokenProgram },
  )

  const signature = await signAndSendTransaction(client, {
    instructions: [burnInstruction],
    latestBlockhash,
    transactionSigner,
  })

  return { signature }
}
