import { useTranslation } from '@workspace/i18n'
import { UiError } from '@workspace/ui/components/ui-error'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useNavigate, useParams } from 'react-router'
import { usePortfolioTokenMint } from './data-access/use-portfolio-token-mint.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiSendMint } from './ui/portfolio-ui-send-mint.tsx'

export function PortfolioFeatureModalSend() {
  const { t } = useTranslation('portfolio')
  const { token } = useParams<{ token: string }>()
  const mint = usePortfolioTokenMint({ token })
  const navigate = useNavigate()

  if (!token) {
    return <UiError message={new Error('Token parameter is unknown')} title="No token" />
  }
  if (!mint) {
    return <UiError message={new Error(`Token with mint ${ellipsify(token)} not found`)} title="Token not found" />
  }

  return (
    <PortfolioUiModal title={t(($) => $.actionSend)}>
      <PortfolioUiSendMint
        isLoading={false}
        mint={mint}
        send={async (input) => await navigate(`/modals/confirm/${token}/${input.destination}/${input.amount}`)}
      />
    </PortfolioUiModal>
  )
}
