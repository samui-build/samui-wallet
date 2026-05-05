import type { Signature } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface GetTransactionBase64Options {
  signature: Signature
}

export type GetTransactionBase64Result = string | null

export async function getTransactionBase64(
  client: SolanaClient,
  { signature }: GetTransactionBase64Options,
): Promise<GetTransactionBase64Result> {
  const tx = await client.rpc
    .getTransaction(signature, {
      encoding: 'base64',
      maxSupportedTransactionVersion: 0,
    })
    .send()

  return tx?.transaction[0] ?? null
}
