import type { Account } from '@workspace/db/entity/account'
import type { Network } from '@workspace/db/entity/network'
import { PortfolioUiNetworkAccountGuard } from '@workspace/portfolio/ui/portfolio-ui-network-guard'
import { UiPage } from '@workspace/ui/components/ui-page'
import { lazy } from 'react'
import { useRoutes } from 'react-router'

const ToolsFeatureAirdrop = lazy(() => import('./tools-feature-airdrop.tsx'))
const ToolsFeatureCreateToken = lazy(() => import('./tools-feature-create-token.tsx'))
const ToolsFeatureMintToken = lazy(() => import('./tools-feature-mint-token.tsx'))
const ToolsFeatureOverview = lazy(() => import('./tools-feature-overview.tsx'))

export function Router(props: { account: Account; network: Network }) {
  return useRoutes([
    { element: <ToolsFeatureOverview />, index: true },
    { element: <ToolsFeatureAirdrop {...props} />, path: 'airdrop' },
    { element: <ToolsFeatureCreateToken {...props} />, path: 'create-token' },
    { element: <ToolsFeatureMintToken />, path: 'mint-token' },
    { element: <ToolsFeatureMintToken />, path: 'create-nft' },
  ])
}

export default function ToolsRoutes() {
  return (
    <UiPage>
      <PortfolioUiNetworkAccountGuard render={(props) => <Router {...props} />} />
    </UiPage>
  )
}
