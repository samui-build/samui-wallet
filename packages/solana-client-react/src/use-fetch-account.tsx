import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { fetchAccount } from '@workspace/solana-client/fetch-account'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function fetchAccountQueryOptions({
  address,
  client,
  network,
}: {
  address: Address
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: () => fetchAccount(client, { address }),
    queryKey: ['fetchAccount', network.endpoint, address],
    retry: false,
  })
}

export function useFetchAccount({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery(fetchAccountQueryOptions({ address, client, network }))
}
