import type { Env } from '@workspace/env/env'

import { env } from '@workspace/env/env'

import type { Cluster } from './entity/cluster'
import type { ClusterType } from './entity/cluster-type'

const clusterEnvVars: (keyof Env)[] = ['clusterDevnet', 'clusterLocalnet', 'clusterMainnet', 'clusterTestnet']

export function getDefaultClusters(): Cluster[] {
  const now = new Date()
  return clusterEnvVars
    .map((key) => ({ endpoint: env(key), key }))
    .filter((item) => !!item.endpoint.length)
    .map(({ endpoint, key }) => ({
      createdAt: now,
      endpoint,
      endpointSubscriptions: env(getEndpointSubscriptionsTypeFromEnv(key)),
      id: key,
      name: key.replace('cluster', ''),
      type: getClusterTypeFromEnv(key),
      updatedAt: now,
    }))
}

function getClusterTypeFromEnv(env: keyof Env): ClusterType {
  switch (env) {
    case 'clusterDevnet':
      return 'solana:devnet'
    case 'clusterLocalnet':
      return 'solana:localnet'
    case 'clusterMainnet':
      return 'solana:mainnet'
    case 'clusterTestnet':
      return 'solana:testnet'
    default:
      throw new Error(`Cannot get cluster type from ${env}`)
  }
}
function getEndpointSubscriptionsTypeFromEnv(env: keyof Env): keyof Env {
  switch (env) {
    case 'clusterDevnet':
      return 'clusterDevnetSubscriptions'
    case 'clusterLocalnet':
      return 'clusterLocalnetSubscriptions'
    case 'clusterMainnet':
      return 'clusterMainnetSubscriptions'
    case 'clusterTestnet':
      return 'clusterTestnetSubscriptions'
    default:
      throw new Error(`Cannot get subscriptions endpoint from ${env}`)
  }
}
