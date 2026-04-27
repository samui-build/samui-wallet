import type { Signature } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export async function getTransactionBase64(client: SolanaClient, { signature }: { signature: Signature }) {
  const tx = await client.rpc
    .getTransaction(signature, {
      encoding: 'base64',
      maxSupportedTransactionVersion: 0,
    })
    .send()

  return tx?.transaction[0] ?? null
}
