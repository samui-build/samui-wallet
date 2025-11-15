import type { SolanaNetwork } from './solana-network.ts'

export type ExplorerPath = `/address/${string}` | `/block/${string}` | `/tx/${string}`
export type ExplorerProvider = 'orb' | 'solana' | 'solscan'
export const explorerProviders: ExplorerProvider[] = ['solana', 'solscan', 'orb'] as const

export interface GetNetworkSuffixProps {
  endpoint: string
  type: SolanaNetwork
}

export interface GetExplorerUrlProps {
  network: GetNetworkSuffixProps
  path: ExplorerPath
  provider: ExplorerProvider
}

export function getExplorerUrl({ network, path, provider }: GetExplorerUrlProps) {
  if (!(path.startsWith('/address') || path.startsWith('/block') || path.startsWith('/tx'))) {
    throw new Error('Invalid path. Must be /address, /block, or /tx.')
  }
  if (!explorerProviders.includes(provider)) {
    throw new Error(`Invalid provider. Must be one of ${explorerProviders.join(', ')}.`)
  }
  const url = new URL(getExplorerBaseUrl(provider))
  url.pathname = path
  const params = getExplorerSuffix(network)
  if (params.cluster.length) {
    url.searchParams.set('cluster', params.cluster)
  }
  if (params.customUrl.length) {
    url.searchParams.set('customUrl', params.customUrl)
  }
  return url.toString()
}

function getExplorerBaseUrl(provider: ExplorerProvider) {
  switch (provider) {
    case 'orb':
      return 'https://orb.helius.dev'
    case 'solscan':
      return 'https://solscan.io'
    default:
      return 'https://explorer.solana.com'
  }
}

function getExplorerSuffix(props: GetNetworkSuffixProps): {
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

export function getExplorerName(provider: ExplorerProvider): string {
  switch (provider) {
    case 'orb':
      return 'Helius Orb'
    case 'solana':
      return 'Solana Explorer'
    case 'solscan':
      return 'Solscan'
    default:
      return 'Unknown'
  }
}
