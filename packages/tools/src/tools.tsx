import {
  LucideCamera,
  LucideCoins,
  LucideHandCoins,
  type LucideIcon,
  LucideImage,
  LucideUmbrella,
  LucideUploadCloud,
} from 'lucide-react'

export interface Tool {
  comingSoon?: boolean
  icon: LucideIcon
  label: string
  path: string
}

export const tools: Tool[] = [
  { comingSoon: false, icon: LucideUmbrella, label: 'Airdrop', path: '/tools/airdrop' },
  { comingSoon: true, icon: LucideUploadCloud, label: 'Arweave Uploader', path: '/tools/arweave-uploader' },
  { comingSoon: true, icon: LucideImage, label: 'NFT Creator', path: '/tools/nft-creator' },
  { comingSoon: true, icon: LucideCamera, label: 'NFT Snapshots', path: '/tools/nft-snapshots' },
  { comingSoon: false, icon: LucideCoins, label: 'Token Creator', path: '/tools/create-token' },
  { comingSoon: true, icon: LucideHandCoins, label: 'Token Minter', path: '/tools/mint-token' },
]
