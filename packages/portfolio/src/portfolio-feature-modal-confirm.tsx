import { useTranslation } from '@workspace/i18n'
import { UiError } from '@workspace/ui/components/ui-error'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useNavigate, useParams } from 'react-router'
import { usePortfolioTokenMint } from './data-access/use-portfolio-token-mint.tsx'
import { usePortfolioTxSend } from './data-access/use-portfolio-tx-send.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiSendConfirm } from './ui/portfolio-ui-send-confirm.tsx'

export function PortfolioFeatureModalConfirm() {
  const { t } = useTranslation('portfolio')
  const { amount, destination, token } = useParams<{ amount: string; destination: string; token: string }>()
  const mint = usePortfolioTokenMint({ token })
  const navigate = useNavigate()
  const confirmMutation = usePortfolioTxSend()
  if (!token) {
    return <UiError message={new Error('Token parameter is unknown')} title="No token" />
  }

  if (!mint) {
    return <UiError message={new Error(`Token with mint ${ellipsify(token)} not found`)} title="Token not found" />
  }

  if (!amount) {
    return <UiError message={new Error('Parameter amount is unknown')} title="No amount" />
  }

  if (!destination) {
    return <UiError message={new Error('Parameter destination is unknown')} title="No destination" />
  }

  return (
    <PortfolioUiModal title={t(($) => $.actionConfirm)}>
      <PortfolioUiSendConfirm
        amount={amount}
        confirm={async (input) => {
          const signature = await confirmMutation.mutateAsync(input)
          if (signature) {
            await navigate(`/modals/complete/${signature}`)
          }
        }}
        destination={destination}
        isLoading={confirmMutation.isPending}
        mint={mint}
      />
    </PortfolioUiModal>
  )
}
