import { useTranslation } from '@workspace/i18n'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useRoutes } from 'react-router'
import { PortfolioFeatureModalConfirm } from './portfolio-feature-modal-confirm.tsx'
import { PortfolioFeatureModalReceive } from './portfolio-feature-modal-receive.tsx'
import { PortfolioFeatureModalSelectTokens } from './portfolio-feature-modal-select-tokens.tsx'
import { PortfolioFeatureModalSend } from './portfolio-feature-modal-send.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'

export default function PortfolioModals() {
  const { t } = useTranslation('ui')
  return useRoutes([
    { element: <PortfolioFeatureModalReceive />, path: 'receive' },
    { element: <PortfolioFeatureModalSelectTokens />, path: 'tokens' },
    { element: <PortfolioFeatureModalSend />, path: 'send/:token' },
    { element: <PortfolioFeatureModalConfirm />, path: 'confirm/:token/:destination/:amount' },
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
