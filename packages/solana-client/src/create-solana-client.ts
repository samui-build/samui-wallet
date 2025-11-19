import type { ClusterUrl } from '@solana/kit'
import { createSolanaRpc, createSolanaRpcSubscriptions } from '@solana/kit'
import type { SolanaClient } from './solana-client.ts'

export function createSolanaClient<TClusterUrl extends ClusterUrl>({
  url,
  urlSubscriptions,
}: {
  url: TClusterUrl
  urlSubscriptions?: TClusterUrl | undefined
}): SolanaClient<TClusterUrl> {
  if (!url.startsWith('http')) {
    throw new Error('Invalid url')
  }
  if (urlSubscriptions?.trim().length && !urlSubscriptions.startsWith('ws')) {
    throw new Error('Invalid subscription url')
  }
  const rpcSubscriptionsUrl = urlSubscriptions?.length ? urlSubscriptions : url.replace('http', 'ws')
  return {
    rpc: createSolanaRpc(url),
    rpcSubscriptions: createSolanaRpcSubscriptions(rpcSubscriptionsUrl),
  }
}
