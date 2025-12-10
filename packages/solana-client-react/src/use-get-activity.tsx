import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { getActivity } from '@workspace/solana-client/get-activity'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from './use-solana-client.tsx'

export function getActivityQueryOptions({
  address,
  network,
  client,
}: {
  address: Address
  network: Network
  client: SolanaClient
}) {
  return queryOptions({
    queryFn: () => getActivity(client, { address }),
    queryKey: ['getActivity', network.endpoint, address],
  })
}

export function useGetActivity({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery(getActivityQueryOptions({ address, client, network }))
}
