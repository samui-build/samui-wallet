import type { Address } from '@solana/kit'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { getBalance } from '@workspace/solana-client/get-balance'

import { useSolanaClient } from './use-solana-client'

export function getBalanceQueryOptions({
  address,
  client,
  cluster,
}: {
  address: Address
  client: SolanaClient
  cluster: Cluster
}) {
  return queryOptions({
    queryFn: () => getBalance(client, { address }),
    queryKey: ['getBalance', cluster.endpoint, address],
  })
}

export function useGetBalance({ address, cluster }: { address: Address; cluster: Cluster }) {
  const client = useSolanaClient({ cluster })

  return useQuery(getBalanceQueryOptions({ address, client, cluster }))
}
