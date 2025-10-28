import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { getAccountInfo } from '@workspace/solana-client/get-account-info'

import { useSolanaClient } from './use-solana-client'

export function getAccountInfoQueryOptions({
  client,
  cluster,
  wallet,
}: {
  client: SolanaClient
  cluster: Cluster
  wallet: Wallet
}) {
  return queryOptions({
    queryFn: () => getAccountInfo(client, { address: wallet.publicKey }),
    queryKey: ['get-account-info', { cluster, publicKey: wallet.publicKey }],
  })
}

export function useGetAccountInfo({ cluster, wallet }: { cluster: Cluster; wallet: Wallet }) {
  const client = useSolanaClient({ cluster })

  return useQuery(getAccountInfoQueryOptions({ client, cluster, wallet }))
}
