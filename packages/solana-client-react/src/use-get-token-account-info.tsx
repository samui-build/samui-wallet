import type { Address } from '@solana/kit'
import { queryOptions, useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/network/network'
import {
  getTokenAccountInfo,
  getTokenAccountProgramAddress,
  type TokenAccountInfoWithTokenProgram,
} from '@workspace/solana-client/get-token-account-info'
import type { SolanaClient } from '@workspace/solana-client/solana-client'

import { useSolanaClient } from './use-solana-client.tsx'

export function getTokenAccountInfoQueryOptions({
  address,
  client,
  network,
}: {
  address: Address
  client: SolanaClient
  network: Network
}) {
  return queryOptions({
    queryFn: async (): Promise<TokenAccountInfoWithTokenProgram> => {
      const account = await getTokenAccountInfo(client, { address })

      return {
        ...account,
        tokenProgram: getTokenAccountProgramAddress({ account }),
      }
    },
    queryKey: ['getTokenAccountInfo', network.endpoint, address],
  })
}

export function useGetTokenAccountInfo({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery(getTokenAccountInfoQueryOptions({ address, client, network }))
}
