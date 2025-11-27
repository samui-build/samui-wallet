import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useRoutes } from 'react-router'
import { ExplorerFeatureAccount } from './explorer-feature-account.tsx'
import { ExplorerFeatureAccountRedirect } from './explorer-feature-account-redirect.tsx'
import { ExplorerFeatureBookmarkAccountList } from './explorer-feature-bookmark-account-list.tsx'
import { ExplorerFeatureBookmarkTransactionList } from './explorer-feature-bookmark-transaction-list.tsx'
import { ExplorerFeatureIndex } from './explorer-feature-index.tsx'
import { ExplorerFeatureTransaction } from './explorer-feature-transaction.tsx'

export default function ExplorerRoutes({ basePath }: { basePath: string }) {
  return useRoutes([
    { element: <ExplorerFeatureIndex basePath={basePath} />, index: true },
    { element: <ExplorerFeatureAccount basePath={basePath} />, path: 'address/:address' },
    { element: <ExplorerFeatureTransaction basePath={basePath} />, path: 'tx/:signature' },
    { element: <ExplorerFeatureBookmarkAccountList basePath={basePath} />, path: 'bookmarks/account' },
    { element: <ExplorerFeatureBookmarkTransactionList basePath={basePath} />, path: 'bookmarks/transaction' },
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
