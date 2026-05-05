import type { Address } from '@solana/kit'

import type { GetTokenAccountsByOwnerResult } from './get-token-accounts-for-program-id.ts'
import type { SolanaClient } from './solana-client.ts'

export interface GetTokenAccountsForMintOptions {
  address: Address
  mint: Address
}

export type GetTokenAccountsForMintResult = GetTokenAccountsByOwnerResult

export async function getTokenAccountsForMint(
  client: SolanaClient,
  { address, mint }: GetTokenAccountsForMintOptions,
): Promise<GetTokenAccountsForMintResult> {
  return await client.rpc
    .getTokenAccountsByOwner(address, { mint }, { commitment: 'confirmed', encoding: 'jsonParsed' })
    .send()
}
