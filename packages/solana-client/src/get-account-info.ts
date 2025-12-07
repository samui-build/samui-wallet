import type { Address, GetAccountInfoApi } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export type GetAccountInfoResult = ReturnType<GetAccountInfoApi['getAccountInfo']>

export function getAccountInfo(client: SolanaClient, { address }: { address: Address }): Promise<GetAccountInfoResult> {
  return client.rpc.getAccountInfo(address).send()
}
