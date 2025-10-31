import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { queryOptions, useQuery } from '@tanstack/react-query'
import { getTokenAccounts } from '@workspace/solana-client/get-token-accounts'

import { useSolanaClient } from './use-solana-client'

export function getTokenAccountsQueryOptions({
  client,
  cluster,
  wallet,
}: {
  client: SolanaClient
  cluster: Cluster
  wallet: Wallet
}) {
  return queryOptions({
    queryFn: () => getTokenAccounts(client, { address: wallet.publicKey }),
    queryKey: ['get-token-accounts', { cluster, publicKey: wallet?.publicKey }],
  })
}

export function useGetTokenAccounts({ cluster, wallet }: { cluster: Cluster; wallet: Wallet }) {
  const client = useSolanaClient({ cluster })

  return useQuery(getTokenAccountsQueryOptions({ client, cluster, wallet }))
}
