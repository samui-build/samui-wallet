import type { UiIconName } from '@workspace/ui/components/ui-icon-map'

export interface Tool {
  comingSoon?: boolean
  icon: UiIconName
  label: string
  path: string
}

export const tools: Tool[] = [
  { comingSoon: false, icon: 'airdrop', label: 'Airdrop', path: '/tools/airdrop' },
  { comingSoon: true, icon: 'upload', label: 'Arweave Uploader', path: '/tools/arweave-uploader' },
  { comingSoon: true, icon: 'image', label: 'NFT Creator', path: '/tools/nft-creator' },
  { comingSoon: true, icon: 'camera', label: 'NFT Snapshots', path: '/tools/nft-snapshots' },
  { comingSoon: false, icon: 'coins', label: 'Token Creator', path: '/tools/create-token' },
  { comingSoon: true, icon: 'handCoins', label: 'Token Minter', path: '/tools/mint-token' },
]
