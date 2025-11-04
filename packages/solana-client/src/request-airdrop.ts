import { type Address, airdropFactory, lamports } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

const LAMPORTS_PER_SOL = 1_000_000_000n

export interface RequestAirdropOption {
  address: Address
  amount: number
  client: SolanaClient
}

export async function requestAirdrop(options: RequestAirdropOption) {
  // @ts-expect-error rpc clients are scoped to their cluster, we need to figure out how to handle this
  return await airdropFactory(options.client)({
    commitment: 'confirmed',
    lamports: lamports(LAMPORTS_PER_SOL * BigInt(options.amount)),
    recipientAddress: options.address,
  })
}
