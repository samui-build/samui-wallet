import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useQuery } from '@tanstack/react-query'
import { getActivity } from '@workspace/solana-client/get-activity'

import { useSolanaClient } from './use-solana-client'

export function useGetActivity({ cluster, wallet }: { cluster: Cluster; wallet: Wallet }) {
  const client = useSolanaClient({ cluster })

  return useQuery({
    queryFn: () => getActivity(client, { address: wallet.publicKey }),
    queryKey: ['get-activity', { cluster, publicKey: wallet?.publicKey }],
  })
}
