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
  return useRoutes([
    { element: <PortfolioFeatureModalBurn />, path: 'burn/:address' },
    { element: <PortfolioFeatureModalConfirm />, path: 'confirm/:token/:destination/:amount' },
    { element: <PortfolioFeatureModalComplete />, path: 'complete/:signature' },
    { element: <PortfolioFeatureModalReceive />, path: 'receive' },
    { element: <PortfolioFeatureModalSelectTokens />, path: 'send' },
    { element: <PortfolioFeatureModalSelectDestination />, path: 'send/:token' },
    { element: <PortfolioFeatureModalSelectAmount />, path: 'send/:token/:destination' },
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
