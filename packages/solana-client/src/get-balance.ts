import type { Address, GetBalanceApi } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface GetBalanceOptions {
  address: Address
}

export type GetBalanceResult = ReturnType<GetBalanceApi['getBalance']>

export function getBalance(client: SolanaClient, { address }: GetBalanceOptions): Promise<GetBalanceResult> {
  return client.rpc.getBalance(address).send()
}
