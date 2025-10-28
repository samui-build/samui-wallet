import type { Cluster } from '@workspace/db/entity/cluster'

import { createSolanaClient } from '@workspace/solana-client/create-solana-client'
import { useMemo } from 'react'

export function useSolanaClient({ cluster }: { cluster: Cluster }) {
  return useMemo(
    () => createSolanaClient({ url: cluster.endpoint, urlSubscriptions: cluster.endpointSubscriptions }),
    [cluster.endpoint, cluster.endpointSubscriptions],
  )
}
