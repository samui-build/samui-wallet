import { isAddress } from '@solana/kit'
import { useTranslation } from '@workspace/i18n'
import { UiError } from '@workspace/ui/components/ui-error'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useNavigate, useParams } from 'react-router'
import { usePortfolioTokenMint } from './data-access/use-portfolio-token-mint.tsx'
import { usePortfolioTxPreview } from './data-access/use-portfolio-tx-preview.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiSelectAmount } from './ui/portfolio-ui-select-amount.tsx'

export function PortfolioFeatureModalSelectAmount() {
  const { t } = useTranslation('portfolio')
  const { destination, token } = useParams<{ destination: string; token: string }>()
  const mint = usePortfolioTokenMint({ token })
  const _navigate = useNavigate()
  const previewMutation = usePortfolioTxPreview()

  if (!destination || !isAddress(destination)) {
    return <UiError message={new Error('Parameter destination is unknown')} title="No destination" />
  }

  if (!token) {
    return <UiError message={new Error('Parameter token is unknown')} title="No token" />
  }
  if (!mint) {
    return <UiError message={new Error(`Token with mint ${ellipsify(token)} not found`)} title="Token not found" />
  }

  async function submit({ amount }: { amount: string }) {
    //
    if (!destination || !mint?.mint) {
      return
    }
    console.log('amount', amount)
    const res = await previewMutation.mutateAsync({
      amount,
      destination,
      mint,
    })
    console.log('res', res)
    // return await navigate(`/modals/confirm/${token}/${destination}/${amount}`)
  }

  return (
    <PortfolioUiModal title={t(($) => $.actionSelectAmount)}>
      <PortfolioUiSelectAmount destination={destination} isLoading={false} mint={mint} send={submit} />
    </PortfolioUiModal>
  )
}
