import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useTranslation } from '@workspace/i18n'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiReceive } from './ui/portfolio-ui-receive.tsx'

export function PortfolioFeatureModalReceive() {
  const { t } = useTranslation('portfolio')
  const account = useAccountActive()

  return (
    <PortfolioUiModal title={t(($) => $.actionReceive)}>
      <PortfolioUiReceive account={account} />
    </PortfolioUiModal>
  )
}
