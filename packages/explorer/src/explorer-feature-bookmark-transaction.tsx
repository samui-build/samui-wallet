import { useBookmarkTransactionLive } from '@workspace/db-react/use-bookmark-transaction-live'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { Link } from 'react-router'
import { ExplorerUiBookmarkTransactionEmpty } from './ui/explorer-ui-bookmark-transaction-empty.tsx'
import { ExplorerUiBookmarkTransactionList } from './ui/explorer-ui-bookmark-transaction-list.tsx'

export function ExplorerFeatureBookmarkTransaction({ basePath }: { basePath: string }) {
  const { t } = useTranslation('explorer')
  const bookmarkTransactions = useBookmarkTransactionLive()
  return (
    <UiCard
      action={
        <Button asChild variant="outline">
          <Link to={`${basePath}/bookmarks/transaction`}>{t(($) => $.actionManage)}</Link>
        </Button>
      }
      description={t(($) => $.bookmarkTransactionDescription)}
      title={t(($) => $.bookmarkTransactionTitle)}
    >
      {bookmarkTransactions?.length ? (
        <ExplorerUiBookmarkTransactionList basePath={basePath} items={bookmarkTransactions ?? []} />
      ) : (
        <ExplorerUiBookmarkTransactionEmpty />
      )}
    </UiCard>
  )
}
