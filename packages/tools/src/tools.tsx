import type { UiIconName } from '@workspace/ui/components/ui-icon-map'

export interface Tool {
  icon: UiIconName
  label: string
  path: string
}

export const tools: Tool[] = [
  { icon: 'airdrop', label: 'Airdrop', path: '/tools/airdrop' },
  { icon: 'coins', label: 'Token Creator', path: '/tools/create-token' },
  { icon: 'wallet', label: 'Wallet Playground', path: '/tools/wallet-playground' },
]
