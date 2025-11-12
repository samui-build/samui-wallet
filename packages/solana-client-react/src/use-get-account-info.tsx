import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/entity/network'
import { getAccountInfo } from '@workspace/solana-client/get-account-info'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function getAccountInfoQueryOptions({
  address,
  client,
  network,
}: {
  address: string
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: () => getAccountInfo(client, { address }),
    queryKey: ['getAccountInfo', network.endpoint, address],
  })
}

export function useGetAccountInfo({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery(getAccountInfoQueryOptions({ address, client, network }))
}
