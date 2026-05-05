import type { GetLatestBlockhashApi } from '@solana/kit'
import type { SolanaClient } from './solana-client.ts'

export type LatestBlockhash = ReturnType<GetLatestBlockhashApi['getLatestBlockhash']>['value']

export async function getLatestBlockhash(client: SolanaClient): Promise<LatestBlockhash> {
  return await client.rpc
    .getLatestBlockhash()
    .send()
    .then((res) => res.value)
}
