import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/entity/network'
import { getTokenAccounts } from '@workspace/solana-client/get-token-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function getTokenAccountsQueryOptions({
  address,
  client,
  network,
}: {
  address: string
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: () => getTokenAccounts(client, { address }),
    queryKey: ['getTokenAccounts', network.endpoint, address],
  })
}

export function useGetTokenAccounts({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery(getTokenAccountsQueryOptions({ address, client, network }))
}
