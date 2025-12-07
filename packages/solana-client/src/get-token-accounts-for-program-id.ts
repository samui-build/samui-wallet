import type { Address } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export async function getTokenAccountsForProgramId(
  client: SolanaClient,
  { address, programId }: { address: Address; programId: Address },
) {
  return await client.rpc
    .getTokenAccountsByOwner(address, { programId }, { commitment: 'confirmed', encoding: 'jsonParsed' })
    .send()
}
