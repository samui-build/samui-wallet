import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useTranslation } from '@workspace/i18n'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'

export function PortfolioFeatureModalSelectTokens() {
  const { t } = useTranslation('portfolio')
  const account = useAccountActive()
  const network = useNetworkActive()
  const balances = useGetTokenBalances({ address: account.publicKey, network })

  return (
    <PortfolioUiModal title={t(($) => $.actionSelectToken)}>
      <PortfolioUiTokenBalances items={balances} />
    </PortfolioUiModal>
  )
}
