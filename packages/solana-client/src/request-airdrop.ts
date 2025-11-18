import { type Address, airdropFactory, lamports } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

const LAMPORTS_PER_SOL = 1_000_000_000n

export interface RequestAirdropOption {
  address: Address
  amount: number
  client: SolanaClient
}

export async function requestAirdrop(options: RequestAirdropOption) {
  return await airdropFactory(options.client)({
    commitment: 'confirmed',
    lamports: lamports(LAMPORTS_PER_SOL * BigInt(options.amount)),
    recipientAddress: options.address,
  })
}
