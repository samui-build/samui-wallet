import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Cluster } from '@workspace/db/entity/cluster'
import { getActivity } from '@workspace/solana-client/get-activity'

import { useSolanaClient } from './use-solana-client.tsx'

export function useGetActivity({ address, cluster }: { address: Address; cluster: Cluster }) {
  const client = useSolanaClient({ cluster })

  return useQuery({
    queryFn: () => getActivity(client, { address }),
    queryKey: ['getActivity', cluster.endpoint, address],
  })
}
