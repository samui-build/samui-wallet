import type { ClusterUrl } from '@solana/kit'

import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'

export function createSolanaClient({ url, urlSubscriptions }: { url: ClusterUrl; urlSubscriptions?: ClusterUrl }) {
  if (!url.startsWith('http')) {
    throw new Error('Invalid cluster url')
  }
  if (urlSubscriptions && !urlSubscriptions.startsWith('ws')) {
    throw new Error('Invalid cluster subscription url')
  }
  return {
    rpc: createSolanaRpc(url),
    rpcSubscriptions: createSolanaRpcSubscriptions(urlSubscriptions ?? url.replace('http', 'ws')),
  }
}
