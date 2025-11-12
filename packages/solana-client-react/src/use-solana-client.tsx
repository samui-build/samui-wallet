import type { Network } from '@workspace/db/entity/network'

import { createSolanaClient } from '@workspace/solana-client/create-solana-client'
import { useMemo } from 'react'

export function useSolanaClient({ network }: { network: Network }) {
  return useMemo(
    () => createSolanaClient({ url: network.endpoint, urlSubscriptions: network.endpointSubscriptions }),
    [network.endpoint, network.endpointSubscriptions],
  )
}
