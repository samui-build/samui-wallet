import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { Link } from 'react-router'
import { ExplorerUiBookmarkTransactionEmpty } from './ui/explorer-ui-bookmark-transaction-empty.tsx'

export function ExplorerFeatureBookmarkTx({ basePath }: { basePath: string }) {
  const { t } = useTranslation('explorer')
  return (
    <UiCard
      action={
        <Button asChild variant="outline">
          <Link to={`${basePath}/bookmarks/tx`}>{t(($) => $.actionManage)}</Link>
        </Button>
      }
      description={t(($) => $.transactionBookmarksDescription)}
      title={t(($) => $.transactionBookmarksTitle)}
    >
      <ExplorerUiBookmarkTransactionEmpty />
    </UiCard>
  )
}
