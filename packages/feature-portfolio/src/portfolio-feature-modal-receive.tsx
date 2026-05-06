import type { Account } from '@workspace/db/account/account'
import { useTranslation } from '@workspace/i18n'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiReceive } from './ui/portfolio-ui-receive.tsx'

export function PortfolioFeatureModalReceive({ account }: { account: Account }) {
  const { t } = useTranslation('portfolio')

  return (
    <PortfolioUiModal title={t(($) => $.actionReceive)}>
      <PortfolioUiReceive address={account.publicKey} />
    </PortfolioUiModal>
  )
}
