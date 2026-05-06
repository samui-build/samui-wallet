import { useTranslation } from '@workspace/i18n'
import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useNavigate } from 'react-router'
import { ExplorerFeatureBookmarkAccount } from './explorer-feature-bookmark-account.tsx'
import { ExplorerFeatureBookmarkTransaction } from './explorer-feature-bookmark-transaction.tsx'
import { ExplorerUiSearch } from './ui/explorer-ui-search.tsx'

export function ExplorerFeatureIndex({ basePath }: { basePath: string }) {
  const { t } = useTranslation('explorer')
  const navigate = useNavigate()
  return (
    <UiPage>
      <UiEmpty
        className="border-solid"
        description={t(($) => $.pageExplorerDescription)}
        icon="explorer"
        title={t(($) => $.pageExplorerTitle)}
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
        <ExplorerFeatureBookmarkTransaction basePath={basePath} />
      </div>
    </UiPage>
  )
}
