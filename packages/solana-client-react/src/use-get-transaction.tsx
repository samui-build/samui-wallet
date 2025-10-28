import type { Cluster } from '@workspace/db/entity/cluster'
import type { UnixTimestamp } from '@workspace/solana-client'

import { useQuery } from '@tanstack/react-query'
import { assertIsSignature } from '@workspace/solana-client'
import { isValidSignature } from '@workspace/solana-client/is-valid-signature'

import { useSolanaClient } from './use-solana-client'

export interface Header {
  numReadonlySignedAccounts: number
  numReadonlyUnsignedAccounts: number
  numRequiredSignatures: number
}

export interface Instruction {
  accounts: number[]
  data: string
  programIdIndex: number
  stackHeight: number
}

export interface Transaction {
  message: TransactionMessage
  signatures: string[]
}

export interface TransactionData {
  blockTime: null | UnixTimestamp
  meta: null | TransactionDataMeta
  slot: string
  transaction: Transaction
}

export interface TransactionDataLoadedAddresses {
  readonly: string[]
  writable: string[]
}

export interface TransactionDataMeta {
  computeUnitsConsumed: string
  err: null
  fee: string
  loadedAddresses: {
    readonly: string[]
    writable: string[]
  }
  logMessages: string[]
  postBalances: string[]
  preBalances: string[]
  status: TransactionDataStatus
}

export interface TransactionDataStatus {
  Ok: null
}

export interface TransactionMessage {
  accountKeys: string[]
  header: Header
  instructions: Instruction[]
  recentBlockhash: string
}

export function useGetTransaction({ cluster, signature }: { cluster: Cluster; signature: string }) {
  const client = useSolanaClient({ cluster })
  return useQuery({
    enabled: isValidSignature(signature),
    queryFn: () => {
      assertIsSignature(signature)
      return client.rpc.getTransaction(signature).send()
    },
    queryKey: ['get-transaction', { cluster, signature }],
  })
}
