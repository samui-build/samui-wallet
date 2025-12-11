import { useBookmarkTransactionLive } from '@workspace/db-react/use-bookmark-transaction-live'
import { useBookmarkTransactionToggle } from '@workspace/db-react/use-bookmark-transaction-toggle'
import { useBookmarkTransactionUpdate } from '@workspace/db-react/use-bookmark-transaction-update'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiPage } from '@workspace/ui/components/ui-page'
import { useExplorerBackButtonTo } from './data-access/use-explorer-back-button-to.tsx'
import { ExplorerUiBookmarkTransactionTable } from './ui/explorer-ui-bookmark-transaction-table.tsx'

export function ExplorerFeatureBookmarkTransactionList({ basePath }: { basePath: string }) {
  const { t } = useTranslation('explorer')
  const backButtonTo = useExplorerBackButtonTo({ basePath })
  const bookmarkTransactions = useBookmarkTransactionLive()
  const mutationToggle = useBookmarkTransactionToggle()
  const mutationUpdate = useBookmarkTransactionUpdate()
  return (
    <UiPage>
      <UiCard backButtonTo={backButtonTo} title={t(($) => $.bookmarkTransactionTitle)}>
        <ExplorerUiBookmarkTransactionTable
          basePath={basePath}
          items={bookmarkTransactions}
          toggleItem={async ({ signature }) => {
            await mutationToggle.mutateAsync({ signature })
          }}
          updateItem={async (item) => {
            await mutationUpdate.mutateAsync({
              id: item.id,
              input: {
                label: item.label,
              },
              signature: item.signature,
            })
          }}
        />
      </UiCard>
    </UiPage>
  )
}
