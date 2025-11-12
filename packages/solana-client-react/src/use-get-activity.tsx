import type { Address } from '@solana/kit'
import { useQuery } from '@tanstack/react-query'
import type { Network } from '@workspace/db/entity/network'
import { getActivity } from '@workspace/solana-client/get-activity'

import { useSolanaClient } from './use-solana-client.tsx'

export function useGetActivity({ address, network }: { address: Address; network: Network }) {
  const client = useSolanaClient({ network })

  return useQuery({
    queryFn: () => getActivity(client, { address }),
    queryKey: ['getActivity', network.endpoint, address],
  })
}
