import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Cluster } from '@workspace/db/entity/cluster'
import { getBalance } from '@workspace/solana-client/get-balance'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

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
