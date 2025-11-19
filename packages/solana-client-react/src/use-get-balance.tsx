import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { getBalance } from '@workspace/solana-client/get-balance'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function getBalanceQueryOptions({
  address,
  client,
  network,
}: {
  address: Address
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: () => getBalance(client, { address }),
    queryKey: ['getBalance', network.endpoint, address],
  })
}

export function useGetBalance({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery(getBalanceQueryOptions({ address, client, network }))
}
