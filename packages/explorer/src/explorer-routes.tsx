import type { Network } from '@workspace/db/entity/network'
import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useMemo } from 'react'
import { useRoutes } from 'react-router'
import { ExplorerFeatureAccount } from './explorer-feature-account.tsx'
import { ExplorerFeatureAccountRedirect } from './explorer-feature-account-redirect.tsx'
import { ExplorerFeatureIndex } from './explorer-feature-index.tsx'
import { ExplorerFeatureTx } from './explorer-feature-tx.tsx'

export default function ExplorerRoutes({ basePath }: { basePath: string }) {
  const networkLive = useDbNetworkLive()
  const [activeId] = useDbSetting('activeNetworkId')
  const network = useMemo(() => networkLive.find((item) => item.id === activeId), [activeId, networkLive])

  return network ? <Routes basePath={basePath} network={network} /> : <div>Network not selected</div>
}

export function Routes({ basePath, network }: { basePath: string; network: Network }) {
  return useRoutes([
    { element: <ExplorerFeatureIndex basePath={basePath} />, index: true },
    { element: <ExplorerFeatureAccount basePath={basePath} network={network} />, path: 'address/:address' },
    { element: <ExplorerFeatureTx />, path: 'tx/:signature' },
    // This route exists to stay compatible with other explorers in the ecosystem
    { element: <ExplorerFeatureAccountRedirect basePath={basePath} />, path: 'account/:address' },
    {
      element: (
        <UiPage>
          <UiNotFound />
        </UiPage>
      ),
      path: '*',
    },
  ])
}
