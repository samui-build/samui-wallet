import type { ClusterUrl } from '@solana/kit'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'

export function createSolanaClient({
  url,
  urlSubscriptions,
}: {
  url: ClusterUrl
  urlSubscriptions?: ClusterUrl | undefined
}) {
  if (!url.startsWith('http')) {
    throw new Error('Invalid url')
  }
  if (urlSubscriptions?.trim().length && !urlSubscriptions.startsWith('ws')) {
    throw new Error('Invalid subscription url')
  }
  return {
    rpc: createSolanaRpc(url),
    rpcSubscriptions: createSolanaRpcSubscriptions(urlSubscriptions ? urlSubscriptions : url.replace('http', 'ws')),
  }
}
