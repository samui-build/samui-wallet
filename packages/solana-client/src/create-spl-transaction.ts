import { type Address, assertIsAddress, assertIsTransactionSigner, type TransactionSigner } from '@solana/kit'
import { fetchMint } from '@solana-program/token'
import { createSplTransferInstructions } from './create-spl-transfer-instructions.ts'
import { createTransaction } from './create-transaction.ts'
import type { LatestBlockhash } from './get-latest-blockhash.ts'
import type { SolanaClient } from './solana-client.ts'
import type { TransferRecipient } from './transfer-recipient.ts'

export interface CreateSplTransactionOptions {
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  recipients: TransferRecipient[]
  transactionSigner: TransactionSigner
}

export async function createSplTransaction(
  client: SolanaClient,
  { latestBlockhash, mint, recipients, transactionSigner }: CreateSplTransactionOptions,
) {
  for (const { destination } of recipients) {
    assertIsAddress(destination)
  }
  assertIsAddress(mint)
  assertIsTransactionSigner(transactionSigner)
  const mintInfo = await fetchMint(client.rpc, mint)
  const decimals = mintInfo.data.decimals
  const tokenProgram = mintInfo.programAddress

  return createTransaction(client, {
    instructions: await createSplTransferInstructions({
      decimals,
      mint,
      recipients: recipients.map(({ amount, destination }) => ({ amount, destination })),
      source: transactionSigner,
      tokenProgram,
      transactionSigner,
    }),
    latestBlockhash,
    transactionSigner,
  })
}
