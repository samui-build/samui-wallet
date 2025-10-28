import type { Address } from '@solana/kit'

import { airdropFactory, lamports } from '@solana/kit'

import type { SolanaClient } from './solana-client'

const LAMPORTS_PER_SOL = 1_000_000_000n

export async function requestAirdrop({ rpc, rpcSubscriptions }: SolanaClient, recipientAddress: Address) {
  // @ts-expect-error rpc clients are scoped to their cluster, we need to figure out how to handle this
  return await airdropFactory({ rpc, rpcSubscriptions })({
    commitment: 'confirmed',
    lamports: lamports(LAMPORTS_PER_SOL),
    recipientAddress,
  })
}
