import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useAccountGetTransactionSigner } from '@workspace/db-react/use-account-get-transaction-signer'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { lazy } from 'react'
import { useRoutes } from 'react-router'
import { ToolsUiLayout } from './ui/tools-ui-layout.tsx'

const ToolsFeatureAirdrop = lazy(() => import('./tools-feature-airdrop.tsx'))
const ToolsFeatureCreateToken = lazy(() => import('./tools-feature-create-token.tsx'))
const ToolsFeatureMintToken = lazy(() => import('./tools-feature-mint-token.tsx'))
const ToolsFeatureStake = lazy(() => import('./tools-feature-stake.tsx'))
const ToolsFeatureTransactionInspector = lazy(() => import('./tools-feature-transaction-inspector.tsx'))

export default function ToolsRoutes() {
  const account = useAccountActive()
  const network = useNetworkActive()
  const getTransactionSigner = useAccountGetTransactionSigner({ account })
  return useRoutes([
    {
      children: [
        { element: <ToolsFeatureAirdrop account={account} network={network} />, index: true },
        { element: <ToolsFeatureAirdrop account={account} network={network} />, path: 'airdrop' },
        {
          element: (
            <ToolsFeatureCreateToken account={account} getTransactionSigner={getTransactionSigner} network={network} />
          ),
          path: 'create-token',
        },
        { element: <ToolsFeatureMintToken />, path: 'mint-token' },
        { element: <ToolsFeatureMintToken />, path: 'create-nft' },
        {
          element: (
            <ToolsFeatureStake
              address={account.publicKey}
              getTransactionSigner={getTransactionSigner}
              network={network}
            />
          ),
          path: 'stake/*',
        },
        { element: <ToolsFeatureTransactionInspector />, path: 'transaction-inspector' },
      ],
      element: <ToolsUiLayout />,
    },
  ])
}
