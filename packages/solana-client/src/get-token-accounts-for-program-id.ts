import type { Address } from '@solana/kit'

import { address as addressFn } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export async function getTokenAccountsForProgramId(
  client: SolanaClient,
  { address, programId }: { address: string; programId: Address },
) {
  return await client.rpc
    .getTokenAccountsByOwner(addressFn(address), { programId }, { commitment: 'confirmed', encoding: 'jsonParsed' })
    .send()
}
