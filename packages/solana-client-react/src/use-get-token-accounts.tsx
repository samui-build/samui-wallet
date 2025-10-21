import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { useQuery } from '@tanstack/react-query'
import { getTokenAccounts } from '@workspace/solana-client/get-token-accounts'

import { useSolanaClient } from './use-solana-client'

export function useGetTokenAccounts({ cluster, wallet }: { cluster: Cluster; wallet: Wallet }) {
  const client = useSolanaClient({ cluster })

  return useQuery({
    queryFn: () => getTokenAccounts(client, { address: wallet.publicKey }),
    queryKey: ['get-token-accounts', { cluster, publicKey: wallet?.publicKey }],
  })
}
