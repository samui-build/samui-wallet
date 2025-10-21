import type { GetSignaturesForAddressApi } from '@solana/kit'

import { address as addressFn } from '@solana/kit'

import type { SolanaClient } from './solana-client'

export type GetActivityResult = ReturnType<GetSignaturesForAddressApi['getSignaturesForAddress']>

export function getActivity(client: SolanaClient, { address }: { address: string }): Promise<GetActivityResult> {
  return client.rpc.getSignaturesForAddress(addressFn(address)).send()
}
