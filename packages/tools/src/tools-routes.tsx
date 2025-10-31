import type { Cluster } from '@workspace/db/entity/cluster'
import type { Wallet } from '@workspace/db/entity/wallet'

import { PortfolioUiClusterWalletGuard } from '@workspace/portfolio/ui/portfolio-ui-cluster-guard'
import { lazy } from 'react'
import { useRoutes } from 'react-router'

const ToolsFeatureAirdrop = lazy(() => import('./tools-feature-airdrop.js'))
const ToolsFeatureCreateToken = lazy(() => import('./tools-feature-create-token.js'))
const ToolsFeatureMintToken = lazy(() => import('./tools-feature-mint-token.js'))
const ToolsFeatureOverview = lazy(() => import('./tools-feature-overview.js'))

export function Router(props: { cluster: Cluster; wallet: Wallet }) {
  return useRoutes([
    { element: <ToolsFeatureOverview />, index: true },
    { element: <ToolsFeatureAirdrop {...props} />, path: 'airdrop' },
    { element: <ToolsFeatureCreateToken {...props} />, path: 'create-token' },
    { element: <ToolsFeatureMintToken />, path: 'mint-token' },
    { element: <ToolsFeatureMintToken />, path: 'create-nft' },
  ])
}

export default function ToolsRoutes() {
  return <PortfolioUiClusterWalletGuard render={(props) => <Router {...props} />} />
}
