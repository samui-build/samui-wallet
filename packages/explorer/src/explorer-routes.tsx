import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useRoutes } from 'react-router'
import { ExplorerFeatureAccount } from './explorer-feature-account.tsx'
import { ExplorerFeatureAccountRedirect } from './explorer-feature-account-redirect.tsx'
import { ExplorerFeatureIndex } from './explorer-feature-index.tsx'
import { ExplorerFeatureTx } from './explorer-feature-tx.tsx'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'

export default function ExplorerRoutes({ basePath }: { basePath: string }) {
  return useRoutes([
    { element: <ExplorerFeatureIndex basePath={basePath} />, index: true },
    { element: <ExplorerFeatureAccount />, path: 'address/:address' },
    { element: <ExplorerFeatureTx />, path: 'tx/:signature' },
    // This route exists to stay compatible with other explorers in the ecosystem
    { element: <ExplorerFeatureAccountRedirect basePath={basePath} />, path: 'account/:address' },
    {
      element: (
        <ExplorerUiPage>
          <UiNotFound />
        </ExplorerUiPage>
      ),
      path: '*',
    },
  ])
}
