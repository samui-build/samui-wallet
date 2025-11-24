import { useTranslation } from '@workspace/i18n'
import { UiEmpty } from '@workspace/ui/components/ui-empty'

export function ExplorerUiBookmarkAccountEmpty() {
  const { t } = useTranslation('explorer')

  return <UiEmpty description={t(($) => $.accountBookmarksEmpty)} />
}
