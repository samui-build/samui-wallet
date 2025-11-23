import type { Env } from '@workspace/env/env'
import { env } from '@workspace/env/env'

import type { Network } from './network/network.ts'
import type { NetworkType } from './network/network-type.ts'

const networkEnvVars: (keyof Env)[] = ['networkDevnet', 'networkLocalnet', 'networkMainnet', 'networkTestnet']

export function populateNetworks(): Network[] {
  const now = new Date()
  return networkEnvVars
    .map((key) => ({ endpoint: env(key), key }))
    .filter((item) => !!item.endpoint.length)
    .map(({ endpoint, key }) => ({
      createdAt: now,
      endpoint,
      endpointSubscriptions: env(getEndpointSubscriptionsTypeFromEnv(key)),
      id: key,
      name: key.replace('network', ''),
      type: getNetworkTypeFromEnv(key),
      updatedAt: now,
    }))
}

function getNetworkTypeFromEnv(env: keyof Env): NetworkType {
  switch (env) {
    case 'networkDevnet':
      return 'solana:devnet'
    case 'networkLocalnet':
      return 'solana:localnet'
    case 'networkMainnet':
      return 'solana:mainnet'
    case 'networkTestnet':
      return 'solana:testnet'
    default:
      throw new Error(`Cannot get network type from ${env}`)
  }
}
function getEndpointSubscriptionsTypeFromEnv(env: keyof Env): keyof Env {
  switch (env) {
    case 'networkDevnet':
      return 'networkDevnetSubscriptions'
    case 'networkLocalnet':
      return 'networkLocalnetSubscriptions'
    case 'networkMainnet':
      return 'networkMainnetSubscriptions'
    case 'networkTestnet':
      return 'networkTestnetSubscriptions'
    default:
      throw new Error(`Cannot get subscriptions endpoint from ${env}`)
  }
}
