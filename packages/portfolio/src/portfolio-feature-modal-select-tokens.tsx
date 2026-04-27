import type { Account } from '@workspace/db/account/account'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import { useGetTokenBalances } from './data-access/use-get-token-metadata.ts'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiTokenBalances } from './ui/portfolio-ui-token-balances.tsx'

export function PortfolioFeatureModalSelectTokens({ account, network }: { account: Account; network: Network }) {
  const { t } = useTranslation('portfolio')
  const balances = useGetTokenBalances({ address: account.publicKey, network })

  return (
    <PortfolioUiModal title={t(($) => $.actionSelectToken)}>
      <PortfolioUiTokenBalances items={balances} />
    </PortfolioUiModal>
  )
}
