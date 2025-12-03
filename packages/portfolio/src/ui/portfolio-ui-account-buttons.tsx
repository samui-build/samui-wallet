import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { UiIcon } from '@workspace/ui/components/ui-icon'
import { Link, useLocation } from 'react-router'

export function PortfolioUiAccountButtons() {
  const { pathname: from } = useLocation()
  const { t } = useTranslation('portfolio')
  const account = useAccountActive()
  const isWatched = account.type === 'Watched'

  return (
    <div className="flex justify-center gap-2">
      <Button asChild variant="secondary">
        <Link state={{ from }} to="/modals/receive">
          <UiIcon icon="arrowDown" /> {t(($) => $.actionReceive)}
        </Link>
      </Button>
      {isWatched ? (
        <Button disabled title={t(($) => $.sendDisabledWatchOnly)} variant="secondary">
          <UiIcon icon="arrowUp" /> {t(($) => $.actionSend)}
        </Button>
      ) : (
        <Button asChild variant="secondary">
          <Link state={{ from }} to="/modals/tokens">
            <UiIcon icon="arrowUp" /> {t(($) => $.actionSend)}
          </Link>
        </Button>
      )}
    </div>
  )
}
