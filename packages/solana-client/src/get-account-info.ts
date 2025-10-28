import type { GetAccountInfoApi } from '@solana/kit'

import { address as addressFn } from '@solana/kit'

import type { SolanaClient } from './solana-client.js'

export type GetAccountInfoResult = ReturnType<GetAccountInfoApi['getAccountInfo']>

export function getAccountInfo(client: SolanaClient, { address }: { address: string }): Promise<GetAccountInfoResult> {
  return client.rpc.getAccountInfo(addressFn(address)).send()
}
