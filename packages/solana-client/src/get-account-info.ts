import type { Address, GetAccountInfoApi } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface GetAccountInfoOptions {
  address: Address
}

export type GetAccountInfoResult = ReturnType<GetAccountInfoApi['getAccountInfo']>

export function getAccountInfo(
  client: SolanaClient,
  { address }: GetAccountInfoOptions,
): Promise<GetAccountInfoResult> {
  return client.rpc.getAccountInfo(address).send()
}
