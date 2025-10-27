import type { Cluster } from '@workspace/db/entity/cluster'

import { useQuery } from '@tanstack/react-query'

import { isValidSignature } from '@workspace/solana-client/is-valid-signature'

import { useSolanaClient } from './use-solana-client'

export function useGetTransaction({ cluster, signature }: { cluster: Cluster; signature: string }) {
  const client = useSolanaClient({ cluster })
  return useQuery({
    enabled: isValidSignature(signature),
    queryFn: () => client.rpc.getTransaction(signature).send(),
    queryKey: ['get-transaction', { cluster, signature }],
  })
}
ey: ['get-transaction', { cluster, signature }],
  })
}
