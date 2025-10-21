import type { GetBalanceApi } from '@solana/kit'

import { address as addressFn } from '@solana/kit'

import type { SolanaClient } from './solana-client'

export type GetBalanceResult = ReturnType<GetBalanceApi['getBalance']>

export function getBalance(client: SolanaClient, { address }: { address: string }): Promise<GetBalanceResult> {
  return client.rpc.getBalance(addressFn(address)).send()
}
