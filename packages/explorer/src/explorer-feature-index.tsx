import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useNavigate } from 'react-router'
import { ExplorerFeatureBookmarkAccount } from './explorer-feature-bookmark-account.tsx'
import { ExplorerFeatureBookmarkTx } from './explorer-feature-bookmark-tx.tsx'
import { ExplorerUiSearch } from './ui/explorer-ui-search.tsx'

export function ExplorerFeatureIndex({ basePath }: { basePath: string }) {
  const navigate = useNavigate()
  return (
    <UiPage>
      <UiEmpty
        className="border-solid"
        description="Search and explore accounts or transactions"
        icon="explorer"
        title="Explorer"
      >
        <div className="w-full">
          <ExplorerUiSearch
            submit={async (input) => {
              return navigate(`${basePath}/${input.type}/${input.query}`)
            }}
          />
        </div>
      </UiEmpty>
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-6 md:gap-y-6">
        <ExplorerFeatureBookmarkAccount basePath={basePath} />
        <ExplorerFeatureBookmarkTx basePath={basePath} />
      </div>
    </UiPage>
  )
}
