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
import type { TransferRecipient } from './transfer-recipient.ts'

export interface CreateAndSendSplTransactionOptions {
  latestBlockhash?: LatestBlockhash | undefined
  mint: Address
  recipients: TransferRecipient[]
  transactionSigner: TransactionSigner
}

export async function createAndSendSplTransaction(
  client: SolanaClient,
  { latestBlockhash, mint, recipients, transactionSigner }: CreateAndSendSplTransactionOptions,
): Promise<Signature> {
  for (const { destination } of recipients) {
    assertIsAddress(destination)
  }
  assertIsAddress(mint)
  assertIsTransactionSigner(transactionSigner)
  const mintInfo = await fetchMint(client.rpc, mint)
  const decimals = mintInfo.data.decimals
  const tokenProgram = mintInfo.programAddress

  return signAndSendTransaction(client, {
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
