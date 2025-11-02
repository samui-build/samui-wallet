import type { Address } from '@solana/kit'
import type { Cluster } from '@workspace/db/entity/cluster'

import { useQuery } from '@tanstack/react-query'
import { getActivity } from '@workspace/solana-client/get-activity'

import { useSolanaClient } from './use-solana-client'

export function useGetActivity({ address, cluster }: { address: Address; cluster: Cluster }) {
  const client = useSolanaClient({ cluster })

  return useQuery({
    queryFn: () => getActivity(client, { address }),
    queryKey: ['getActivity', cluster.endpoint, address],
  })
}
