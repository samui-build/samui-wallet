import {
  type Address,
  assertIsAddress,
  assertIsTransactionSigner,
  type Signature,
  type TransactionSigner,
} from '@solana/kit'
import { fetchMint } from '@solana-program/token'
import { createSplTransferInstructions } from './create-spl-transfer-instructions.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import { signAndSendTransaction } from './sign-and-send-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import { uiAmountToBigInt } from './ui-amount-to-big-int.ts'

export interface CreateAndSendSplTransactionOptions {
  amount: string
  destination: Address
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  transactionSigner: TransactionSigner
}

export async function createAndSendSplTransaction(
  client: SolanaClient,
  { amount, destination, latestBlockhash, mint, transactionSigner }: CreateAndSendSplTransactionOptions,
): Promise<Signature> {
  assertIsAddress(destination)
  assertIsAddress(mint)
  assertIsTransactionSigner(transactionSigner)
  const mintInfo = await fetchMint(client.rpc, mint)
  const decimals = mintInfo.data.decimals
  const tokenProgram = mintInfo.programAddress

  return signAndSendTransaction(client, {
    instructions: await createSplTransferInstructions({
      amount: uiAmountToBigInt(amount, decimals),
      decimals,
      destination,
      mint,
      source: transactionSigner,
      tokenProgram,
      transactionSigner,
    }),
    latestBlockhash,
    transactionSigner,
  })
}
