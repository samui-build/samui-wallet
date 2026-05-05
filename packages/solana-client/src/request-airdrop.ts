import { type Address, airdropFactory, type Lamports, type Signature } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface RequestAirdropOptions {
  address: Address
  amount: Lamports
}

export type RequestAirdropOption = RequestAirdropOptions

export async function requestAirdrop(
  client: SolanaClient,
  { address, amount }: RequestAirdropOptions,
): Promise<Signature> {
  return await airdropFactory(client)({
    commitment: 'confirmed',
    lamports: amount,
    recipientAddress: address,
  })
}
