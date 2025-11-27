import { type Address, airdropFactory, type Lamports } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface RequestAirdropOption {
  address: Address
  amount: Lamports
}

export async function requestAirdrop(client: SolanaClient, { address, amount }: RequestAirdropOption) {
  return await airdropFactory(client)({
    commitment: 'confirmed',
    lamports: amount,
    recipientAddress: address,
  })
}
