import { useAccountActive } from '@workspace/db-react/use-account-active'
import { useAccountGetTransactionSigner } from '@workspace/db-react/use-account-get-transaction-signer'
import { useNetworkActive } from '@workspace/db-react/use-network-active'
import { useTranslation } from '@workspace/i18n'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useRoutes } from 'react-router'
import { PortfolioFeatureModalBurn } from './portfolio-feature-modal-burn.tsx'
import { PortfolioFeatureModalComplete } from './portfolio-feature-modal-complete.tsx'
import { PortfolioFeatureModalConfirm } from './portfolio-feature-modal-confirm.tsx'
import { PortfolioFeatureModalReceive } from './portfolio-feature-modal-receive.tsx'
import { PortfolioFeatureModalSelectAmount } from './portfolio-feature-modal-select-amount.tsx'
import { PortfolioFeatureModalSelectDestination } from './portfolio-feature-modal-select-destination.tsx'
import { PortfolioFeatureModalSelectTokens } from './portfolio-feature-modal-select-tokens.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'

export default function PortfolioModals() {
  const { t } = useTranslation('ui')
  const account = useAccountActive()
  const network = useNetworkActive()
  const getTransactionSigner = useAccountGetTransactionSigner({ account })

  return useRoutes([
    {
      element: (
        <PortfolioFeatureModalBurn account={account} getTransactionSigner={getTransactionSigner} network={network} />
      ),
      path: 'burn/:address',
    },
    {
      element: (
        <PortfolioFeatureModalConfirm
          address={account.publicKey}
          getTransactionSigner={getTransactionSigner}
          network={network}
        />
      ),
      path: 'confirm/:token/:destination/:amount',
    },
    { element: <PortfolioFeatureModalComplete />, path: 'complete/:signature' },
    { element: <PortfolioFeatureModalReceive account={account} />, path: 'receive' },
    { element: <PortfolioFeatureModalSelectTokens account={account} network={network} />, path: 'send' },
    {
      element: <PortfolioFeatureModalSelectDestination address={account.publicKey} network={network} />,
      path: 'send/:token',
    },
    {
      element: <PortfolioFeatureModalSelectAmount address={account.publicKey} network={network} />,
      path: 'send/:token/:destination',
    },
    {
      element: (
        <PortfolioUiModal title={t(($) => $.notFoundTitle)}>
          <UiNotFound />
        </PortfolioUiModal>
      ),
      path: '*',
    },
  ])
}
