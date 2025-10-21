import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useQuery } from '@tanstack/react-query'
import { getBalance } from '@workspace/solana-client/get-balance'

import { useSolanaClient } from './use-solana-client'

export function useGetBalance({ cluster, wallet }: { cluster: Cluster; wallet: Wallet }) {
  const client = useSolanaClient({ cluster })

  return useQuery({
    queryFn: () => getBalance(client, { address: wallet.publicKey }),
    queryKey: ['get-balance', { cluster, publicKey: wallet?.publicKey }],
  })
}
