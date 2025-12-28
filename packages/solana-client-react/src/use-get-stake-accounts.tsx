import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { getStakeAccounts } from '@workspace/solana-client/get-stake-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from './use-solana-client.tsx'

export function getStakeAccountsQueryOptions({
  address,
  client,
  network,
}: {
  address: Address
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: async () => await getStakeAccounts(client, { address }),
    queryKey: ['stake', { address, networkId: network.id }],
    retry: 1,
  })
}

export function useGetStakeAccounts({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })
  return useQuery(getStakeAccountsQueryOptions({ address, client, network }))
}
