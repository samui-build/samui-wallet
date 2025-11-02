import type { Address } from '@solana/kit'
import type { Cluster } from '@workspace/db/entity/cluster'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { getTokenAccounts } from '@workspace/solana-client/get-token-accounts'

import { useSolanaClient } from './use-solana-client'

export function getTokenAccountsQueryOptions({
  address,
  client,
  cluster,
}: {
  address: string
  client: SolanaClient
  cluster: Cluster
}) {
  return queryOptions({
    queryFn: () => getTokenAccounts(client, { address }),
    queryKey: ['getTokenAccounts', cluster.endpoint, address],
  })
}

export function useGetTokenAccounts({ address, cluster }: { address: Address; cluster: Cluster }) {
  const client = useSolanaClient({ cluster })

  return useQuery(getTokenAccountsQueryOptions({ address, client, cluster }))
}
