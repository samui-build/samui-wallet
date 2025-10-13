import type { ClusterType } from './entity/cluster-type'

export const dbClusterTypeOptions: { label: string; value: ClusterType }[] = [
  { label: 'Solana Devnet', value: 'solana:devnet' },
  { label: 'Solana Localnet', value: 'solana:localnet' },
  { label: 'Solana Testnet', value: 'solana:testnet' },
  { label: 'Solana Mainnet', value: 'solana:mainnet' },
]
