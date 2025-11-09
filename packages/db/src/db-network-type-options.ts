import type { NetworkType } from './entity/network-type.ts'

export const dbNetworkTypeOptions: { label: string; value: NetworkType }[] = [
  { label: 'Solana Devnet', value: 'solana:devnet' },
  { label: 'Solana Localnet', value: 'solana:localnet' },
  { label: 'Solana Testnet', value: 'solana:testnet' },
  { label: 'Solana Mainnet', value: 'solana:mainnet' },
]
