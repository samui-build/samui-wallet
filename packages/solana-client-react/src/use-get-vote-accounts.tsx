import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import { getVoteAccounts } from '@workspace/solana-client/get-vote-accounts'
import type { SolanaClient } from '@workspace/solana-client/solana-client'
import { useSolanaClient } from './use-solana-client.tsx'

export type VoteAccount = Awaited<ReturnType<typeof getVoteAccounts>>[number]

export function getVoteAccountsQueryOptions({ client, network }: { client: SolanaClient; network: Network }) {
  return queryOptions({
    queryFn: async () => await getVoteAccounts(client),
    queryKey: ['stake', { networkId: network.id }],
    retry: 1,
    staleTime: 10 * 60 * 1000,
  })
}

export function useGetVoteAccounts({ network }: { network: Network }) {
  const client = useSolanaClient({ network })
  return useQuery(getVoteAccountsQueryOptions({ client, network }))
}
