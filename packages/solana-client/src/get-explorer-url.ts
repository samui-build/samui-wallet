import type { SolanaCluster } from './solana-cluster'

export type ExplorerProvider = 'orb' | 'solana' | 'solscan'
export const explorerProviders: ExplorerProvider[] = ['solana', 'solscan', 'orb'] as const

export interface GetClusterSuffixProps {
  endpoint: string
  type: SolanaCluster
}

export interface GetExplorerUrlProps {
  cluster: GetClusterSuffixProps
  path: `/address/${string}` | `/block/${string}` | `/tx/${string}`
  provider?: ExplorerProvider
}

export function getExplorerUrl({ cluster, path, provider = 'solana' }: GetExplorerUrlProps) {
  if (!(path.startsWith('/address') || path.startsWith('/block') || path.startsWith('/tx'))) {
    throw new Error('Invalid path. Must be /address, /block, or /tx.')
  }
  if (!explorerProviders.includes(provider)) {
    throw new Error(`Invalid provider. Must be one of ${explorerProviders.join(', ')}.`)
  }
  const url = new URL(getExplorerBaseUrl(provider))
  url.pathname = path
  const params = getExplorerClusterSuffix(cluster)
  if (params.cluster.length) {
    url.searchParams.set('cluster', params.cluster)
  }
  if (params.customUrl.length) {
    url.searchParams.set('customUrl', params.customUrl)
  }
  return url.toString()
}

function getExplorerBaseUrl(provider: ExplorerProvider = 'solana') {
  switch (provider) {
    case 'orb':
      return 'https://orb.helius.dev'
    case 'solscan':
      return 'https://solscan.io'
    default:
      return 'https://explorer.solana.com'
  }
}

function getExplorerClusterSuffix(props: GetClusterSuffixProps): {
  cluster: string
  customUrl: string
} {
  switch (props.type) {
    case 'solana:devnet':
      return { cluster: 'devnet', customUrl: '' }
    case 'solana:localnet':
      return { cluster: 'custom', customUrl: props.endpoint }
    case 'solana:testnet':
      return { cluster: 'testnet', customUrl: '' }
    default:
      return { cluster: '', customUrl: '' }
  }
}
