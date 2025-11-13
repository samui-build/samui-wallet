import { useDbAccountActive } from '@workspace/db-react/use-db-account-active'
import { useDbNetworkActive } from '@workspace/db-react/use-db-network-active'
import { UiPage } from '@workspace/ui/components/ui-page'
import { lazy } from 'react'
import { useRoutes } from 'react-router'

const ToolsFeatureAirdrop = lazy(() => import('./tools-feature-airdrop.tsx'))
const ToolsFeatureCreateToken = lazy(() => import('./tools-feature-create-token.tsx'))
const ToolsFeatureMintToken = lazy(() => import('./tools-feature-mint-token.tsx'))
const ToolsFeatureOverview = lazy(() => import('./tools-feature-overview.tsx'))

export default function ToolsRoutes() {
  const account = useDbAccountActive()
  const network = useDbNetworkActive()
  const routes = useRoutes([
    { element: <ToolsFeatureOverview />, index: true },
    { element: <ToolsFeatureAirdrop account={account} network={network} />, path: 'airdrop' },
    { element: <ToolsFeatureCreateToken account={account} network={network} />, path: 'create-token' },
    { element: <ToolsFeatureMintToken />, path: 'mint-token' },
    { element: <ToolsFeatureMintToken />, path: 'create-nft' },
  ])

  return <UiPage>{routes}</UiPage>
}
