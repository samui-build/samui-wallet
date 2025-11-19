import type { Address } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export async function getTokenAccountsForMint(
  client: SolanaClient,
  { address, mint }: { address: Address; mint: Address },
) {
  return await client.rpc
    .getTokenAccountsByOwner(address, { mint }, { commitment: 'confirmed', encoding: 'jsonParsed' })
    .send()
}
