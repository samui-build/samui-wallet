import type { Address, Commitment, Signature, Slot, TransactionError, UnixTimestamp } from '@solana/kit'

import type { SolanaClient } from './solana-client.ts'

export interface GetActivityOptions {
  address: Address
}

export type GetActivityItem = Readonly<{
  blockTime: null | UnixTimestamp
  confirmationStatus: Commitment | null
  err: null | TransactionError
  memo: null | string
  signature: Signature
  slot: Slot
}>

export type GetActivityItems = Readonly<GetActivityItem[]>

export function getActivity(client: SolanaClient, { address }: GetActivityOptions): Promise<GetActivityItems> {
  return client.rpc.getSignaturesForAddress(address).send()
}
