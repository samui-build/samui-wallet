import type { Address, GetBalanceApi } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export type GetBalanceResult = ReturnType<GetBalanceApi['getBalance']>

export function getBalance(client: SolanaClient, { address }: { address: Address }): Promise<GetBalanceResult> {
  return client.rpc.getBalance(address).send()
}
