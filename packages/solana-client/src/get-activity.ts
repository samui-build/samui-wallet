import type { Commitment, Signature, Slot, TransactionError, UnixTimestamp } from '@solana/kit'

import { address as addressFn } from '@solana/kit'

import type { SolanaClient } from './solana-client'

export type GetActivityItem = Readonly<{
  blockTime: null | UnixTimestamp
  confirmationStatus: Commitment | null
  err: null | TransactionError
  memo: null | string
  signature: Signature
  slot: Slot
}>

export type GetActivityItems = Readonly<GetActivityItem[]>

export function getActivity(client: SolanaClient, { address }: { address: string }): Promise<GetActivityItems> {
  return client.rpc.getSignaturesForAddress(addressFn(address)).send()
}
