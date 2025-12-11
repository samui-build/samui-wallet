import { useBookmarkAccountLive } from '@workspace/db-react/use-bookmark-account-live'
import { useBookmarkAccountToggle } from '@workspace/db-react/use-bookmark-account-toggle'
import { useBookmarkAccountUpdate } from '@workspace/db-react/use-bookmark-account-update'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useExplorerBackButtonTo } from './data-access/use-explorer-back-button-to.tsx'
import { ExplorerUiBookmarkAccountTable } from './ui/explorer-ui-bookmark-account-table.tsx'

export function ExplorerFeatureBookmarkAccountList({ basePath }: { basePath: string }) {
  const { t } = useTranslation('explorer')
  const backButtonTo = useExplorerBackButtonTo({ basePath })
  const bookmarkAccounts = useBookmarkAccountLive()
  const mutationToggle = useBookmarkAccountToggle()
  const mutationUpdate = useBookmarkAccountUpdate()
  return (
    <UiPage>
      <UiCard backButtonTo={backButtonTo} title={t(($) => $.bookmarkAccountTitle)}>
        <ExplorerUiBookmarkAccountTable
          basePath={basePath}
          items={bookmarkAccounts}
          toggleItem={async ({ address }) => {
            await mutationToggle.mutateAsync({ address })
          }}
          updateItem={async (item) => {
            await mutationUpdate.mutateAsync({
              address: item.address,
              id: item.id,
              input: {
                label: item.label,
              },
            })
          }}
        />
      </UiCard>
    </UiPage>
  )
}
