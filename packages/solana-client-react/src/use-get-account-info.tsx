import type { Address } from '@solana/kit'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAccountInfo } from '@workspace/solana-client/get-account-info'

import { useSolanaClient } from './use-solana-client'

export function getAccountInfoQueryOptions({
  address,
  client,
  cluster,
}: {
  address: string
  client: SolanaClient
  cluster: Cluster
}) {
  return queryOptions({
    queryFn: () => getAccountInfo(client, { address }),
    queryKey: ['getAccountInfo', cluster.endpoint, address],
  })
}

export function useGetAccountInfo({ address, cluster }: { address: Address; cluster: Cluster }) {
  const client = useSolanaClient({ cluster })

  return useQuery(getAccountInfoQueryOptions({ address, client, cluster }))
}
