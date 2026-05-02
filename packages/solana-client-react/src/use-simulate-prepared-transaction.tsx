import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import {
  type SimulatePreparedTransactionOptions,
  type SimulatePreparedTransactionResult,
  simulatePreparedTransaction,
} from '@workspace/solana-client/simulate-prepared-transaction'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from './use-solana-client.tsx'

export function simulatePreparedTransactionQueryOptions({
  client,
  input,
  network,
}: {
  client: SolanaClient
  input: SimulatePreparedTransactionOptions | undefined
  network: Network
}) {
  return queryOptions({
    enabled: !!input,
    queryFn: async (): Promise<SimulatePreparedTransactionResult> => {
      if (!input) {
        throw new Error('No transaction input')
      }

      return simulatePreparedTransaction(client, input)
    },
    queryKey: [
      'simulatePreparedTransaction',
      network.endpoint,
      input?.transactionSigner.address,
      input?.latestBlockhash?.blockhash,
      getInstructionQueryKey(input),
    ],
  })
}

export function useSimulatePreparedTransaction({
  input,
  network,
}: {
  input: SimulatePreparedTransactionOptions | undefined
  network: Network
}) {
  const client = useSolanaClient({ network })

  return useQuery(simulatePreparedTransactionQueryOptions({ client, input, network }))
}

function getInstructionQueryKey(input: SimulatePreparedTransactionOptions | undefined) {
  return (
    input?.instructions.map((instruction) => ({
      accounts: instruction.accounts?.map((account) => ({
        address: account.address,
        role: account.role,
      })),
      data: instruction.data ? Array.from(instruction.data).join(',') : undefined,
      programAddress: instruction.programAddress,
    })) ?? []
  )
}
