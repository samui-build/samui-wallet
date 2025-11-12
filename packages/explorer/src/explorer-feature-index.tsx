import { UiEmpty } from '@workspace/ui/components/ui-empty'
import { useNavigate } from 'react-router'
import { ExplorerUiPage } from './ui/explorer-ui-page.tsx'
import { ExplorerUiSearch } from './ui/explorer-ui-search.tsx'

export function ExplorerFeatureIndex({ basePath }: { basePath: string }) {
  const navigate = useNavigate()
  return (
    <ExplorerUiPage>
      <UiEmpty description="Search and explore accounts or transactions" icon="explorer" title="Explorer">
        <div className="w-full">
          <ExplorerUiSearch
            submit={async (input) => {
              return navigate(`${basePath}/${input.type}/${input.query}`)
            }}
          />
        </div>
      </UiEmpty>
    </ExplorerUiPage>
  )
}
