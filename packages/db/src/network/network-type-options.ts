import type { NetworkType } from './network-type.ts'

export const networkTypeOptions: { label: string; value: NetworkType }[] = [
  { label: 'Solana Devnet', value: 'solana:devnet' },
  { label: 'Solana Localnet', value: 'solana:localnet' },
  { label: 'Solana Testnet', value: 'solana:testnet' },
  { label: 'Solana Mainnet', value: 'solana:mainnet' },
]
