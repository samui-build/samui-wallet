import type { UiIconName } from '@workspace/ui/components/ui-icon-map'

export interface Tool {
  description: string
  icon: UiIconName
  label: string
  path: string
}

export const tools: Tool[] = [
  {
    description: 'Request test SOL for a wallet address',
    icon: 'airdrop',
    label: 'Airdrop',
    path: 'airdrop',
  },
  {
    description: 'Manage stake accounts for the active wallet',
    icon: 'handCoins',
    label: 'Stake',
    path: 'stake',
  },
  {
    description: 'Create and mint tokens for the active network',
    icon: 'coins',
    label: 'Token Creator',
    path: 'create-token',
  },
  {
    description: 'Parse signatures and raw transactions',
    icon: 'search',
    label: 'Transaction Inspector',
    path: 'transaction-inspector',
  },
]
