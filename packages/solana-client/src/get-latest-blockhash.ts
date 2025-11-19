import type { SolanaClient } from './solana-client.ts'

export type LatestBlockhash = Awaited<ReturnType<typeof getLatestBlockhash>>
export async function getLatestBlockhash(client: SolanaClient) {
  return await client.rpc
    .getLatestBlockhash()
    .send()
    .then((res) => res.value)
}
