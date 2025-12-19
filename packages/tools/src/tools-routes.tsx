import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { UiPage } from '@workspace/ui/components/ui-page'
import { lazy } from 'react'
import { useRoutes } from 'react-router'

const ToolsFeatureAirdrop = lazy(() => import('./tools-feature-airdrop.tsx'))
const ToolsFeatureCreateToken = lazy(() => import('./tools-feature-create-token.tsx'))
const ToolsFeatureMintToken = lazy(() => import('./tools-feature-mint-token.tsx'))
const ToolsFeatureOverview = lazy(() => import('./tools-feature-overview.tsx'))
const WalletPlaygroundFeature = lazy(() => import('@workspace/wallet-playground/playground-feature'))

export default function ToolsRoutes() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const routes = useRoutes([
    { element: <ToolsFeatureOverview />, index: true },
    { element: <ToolsFeatureAirdrop account={account} network={network} />, path: 'airdrop' },
    { element: <ToolsFeatureCreateToken account={account} network={network} />, path: 'create-token' },
    { element: <ToolsFeatureMintToken />, path: 'mint-token' },
    { element: <ToolsFeatureMintToken />, path: 'create-nft' },
    { element: <WalletPlaygroundFeature />, path: 'wallet-playground' },
  ])

  return <UiPage>{routes}</UiPage>
}
