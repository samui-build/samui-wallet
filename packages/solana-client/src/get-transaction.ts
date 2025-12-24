import type { Signature } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export async function getTransaction(client: SolanaClient, { signature }: { signature: Signature }) {
  return client.rpc
    .getTransaction(signature, {
      encoding: 'jsonParsed',
      maxSupportedTransactionVersion: 0,
    })
    .send()
}

export type GetTransactionResult = NonNullable<Awaited<ReturnType<typeof getTransaction>>>
export type GetTransactionResultInstruction =
  // biome-ignore lint/suspicious/noExplicitAny: ongoing type confusion
  GetTransactionResult['transaction']['message']['instructions'][number] & { parsed?: any }
