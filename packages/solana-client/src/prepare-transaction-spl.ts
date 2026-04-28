import type { Address, TransactionSigner } from '@solana/kit'
import { assertIsAddress, assertIsTransactionSigner } from '@solana/kit'
import { fetchMint } from '@solana-program/token'
import { createTransferInstructionsSpl } from './create-transfer-instructions-spl.ts'
import type { PreparedTransaction } from './send-prepared-transaction.ts'
import type { SolanaClient } from './solana-client.ts'
import type { TransferRecipient } from './transfer-recipient.ts'

export interface PrepareTransactionSplOptions {
  mint: Address
  recipients: TransferRecipient[]
  transactionSigner: TransactionSigner
}

export async function prepareTransactionSpl(
  client: SolanaClient,
  { mint, recipients, transactionSigner }: PrepareTransactionSplOptions,
): Promise<PreparedTransaction> {
  for (const { destination } of recipients) {
    assertIsAddress(destination)
  }
  assertIsAddress(mint)
  assertIsTransactionSigner(transactionSigner)
  const mintInfo = await fetchMint(client.rpc, mint)
  const decimals = mintInfo.data.decimals
  const tokenProgram = mintInfo.programAddress

  return {
    instructions: await createTransferInstructionsSpl({
      decimals,
      mint,
      recipients: recipients.map(({ amount, destination }) => ({ amount, destination })),
      source: transactionSigner,
      tokenProgram,
      transactionSigner,
    }),
    transactionSigner,
  }
}
