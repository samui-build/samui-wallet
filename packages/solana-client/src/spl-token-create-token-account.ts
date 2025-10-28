import type { Address } from '@solana/kit'

import type { SolanaClient } from './solana-client'

export interface SplTokenCreateTokenAccountOptions {
  mint: Address
}

export async function splTokenCreateTokenAccount(client: SolanaClient, options: SplTokenCreateTokenAccountOptions) {
  //
  console.log({
    client,
    options,
  })
}
