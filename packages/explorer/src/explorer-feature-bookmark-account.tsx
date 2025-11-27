import { useBookmarkAccountLive } from '@workspace/db-react/use-bookmark-account-live'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiCard } from '@workspace/ui/components/ui-card'
import { Link } from 'react-router'
import { ExplorerUiBookmarkAccountEmpty } from './ui/explorer-ui-bookmark-account-empty.tsx'
import { ExplorerUiBookmarkAccountList } from './ui/explorer-ui-bookmark-account-list.tsx'

export function ExplorerFeatureBookmarkAccount({ basePath }: { basePath: string }) {
  const { t } = useTranslation('explorer')
  const bookmarkAccounts = useBookmarkAccountLive()
  return (
    <UiCard
      action={
        <Button asChild variant="outline">
          <Link to={`${basePath}/bookmarks/account`}>{t(($) => $.actionManage)}</Link>
        </Button>
      }
      description={t(($) => $.bookmarkAccountDescription)}
      title={t(($) => $.bookmarkAccountTitle)}
    >
      {bookmarkAccounts?.length ? (
        <ExplorerUiBookmarkAccountList basePath={basePath} items={bookmarkAccounts ?? []} />
      ) : (
        <ExplorerUiBookmarkAccountEmpty />
      )}
    </UiCard>
  )
}
