import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { STAKE_ACCOUNT_SPACE } from '@workspace/solana-client/create-stake-account'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from './use-solana-client.tsx'

export function getStakeAccountRentReserveQueryOptions({
  client,
  network,
}: {
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: async () => await client.rpc.getMinimumBalanceForRentExemption(STAKE_ACCOUNT_SPACE).send(),
    queryKey: ['stake-rent-reserve', { networkId: network.id }],
    retry: 1,
    staleTime: Infinity,
  })
}

export function useGetStakeAccountRentReserve({ network }: { network: Network }) {
  const client = useSolanaClient({ network })
  return useQuery(getStakeAccountRentReserveQueryOptions({ client, network }))
}
