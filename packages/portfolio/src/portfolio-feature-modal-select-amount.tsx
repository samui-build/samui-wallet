import { address } from '@solana/kit'
import { useTranslation } from '@workspace/i18n'
import { uiAmountToBigInt } from '@workspace/solana-client/ui-amount-to-big-int'
import { UiError } from '@workspace/ui/components/ui-error'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useNavigate, useParams } from 'react-router'
import type { TokenBalance } from './data-access/use-get-token-metadata.ts'
import { usePortfolioTokenMint } from './data-access/use-portfolio-token-mint.tsx'
import { usePortfolioTxCreate } from './data-access/use-portfolio-tx-create.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiSendMint } from './ui/portfolio-ui-send-mint.tsx'

export function PortfolioFeatureModalSelectAmount() {
  const { t } = useTranslation('portfolio')
  const { destination, token } = useParams<{ destination: string; token: string }>()
  const mint = usePortfolioTokenMint({ token })
  const navigate = useNavigate()
  const createMutation = usePortfolioTxCreate()

  async function handleSubmit(input: { amount: string; destination: string; mint: TokenBalance }) {
    console.log('handleSubmit', input)
    const res = await createMutation.mutateAsync({
      mint: input.mint,
      recipients: [
        { amount: uiAmountToBigInt(input.amount, input.mint?.decimals), destination: address(input.destination) },
      ],
    })
    console.log('res', res)
    await navigate(`/modals/confirm/${token}/${input.destination}/${input.amount}`)
    return
  }

  if (!destination) {
    return <UiError message={new Error('Parameter destination is unknown')} title="No destination" />
  }
  if (!token) {
    return <UiError message={new Error('Parameter token is unknown')} title="No token" />
  }
  if (!mint) {
    return <UiError message={new Error(`Token with mint ${ellipsify(token)} not found`)} title="Token not found" />
  }

  return (
    <PortfolioUiModal title={t(($) => $.actionSelectAmount)}>
      <PortfolioUiSendMint destination={destination} isLoading={false} mint={mint} send={handleSubmit} />
    </PortfolioUiModal>
  )
}
