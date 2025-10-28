import type { LucideIcon } from 'lucide-react'

import {
  LucideCamera,
  LucideCoins,
  LucideHandCoins,
  LucideImage,
  LucideUmbrella,
  LucideUploadCloud,
} from 'lucide-react'

import { ToolsUiOverview } from './tools-ui-overview.js'

export interface Tool {
  comingSoon?: boolean
  icon: LucideIcon
  label: string
  path: string
}

const tools: Tool[] = [
  { comingSoon: false, icon: LucideUmbrella, label: 'Airdrop', path: '/tools/airdrop' },
  { comingSoon: true, icon: LucideUploadCloud, label: 'Arweave Uploader', path: '/tools/arweave-uploader' },
  { comingSoon: true, icon: LucideImage, label: 'NFT Creator', path: '/tools/nft-creator' },
  { comingSoon: true, icon: LucideCamera, label: 'NFT Snapshots', path: '/tools/nft-snapshots' },
  { comingSoon: false, icon: LucideCoins, label: 'Token Creator', path: '/tools/create-token' },
  { comingSoon: true, icon: LucideHandCoins, label: 'Token Minter', path: '/tools/mint-token' },
]

export default function ToolsFeatureOverview() {
  return (
    <div className="space-y-6 p-3">
      <ToolsUiOverview tools={tools.filter((t) => !t.comingSoon)} />
      <ToolsUiOverview tools={tools.filter((t) => t.comingSoon)} />
    </div>
  )
}
