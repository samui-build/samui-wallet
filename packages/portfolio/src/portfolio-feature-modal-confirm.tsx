import { type Address, assertIsAddress } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import { UiError } from '@workspace/ui/components/ui-error'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useNavigate, useParams } from 'react-router'
import { getAmountForMint } from './data-access/get-amount-for-mint.ts'
import { usePortfolioTokenMint } from './data-access/use-portfolio-token-mint.tsx'
import { usePortfolioTxPrepare } from './data-access/use-portfolio-tx-prepare.tsx'
import { usePortfolioTxSend } from './data-access/use-portfolio-tx-send.tsx'
import { PortfolioUiModal } from './ui/portfolio-ui-modal.tsx'
import { PortfolioUiSendConfirm } from './ui/portfolio-ui-send-confirm.tsx'

export function PortfolioFeatureModalConfirm({
  address,
  getTransactionSigner,
  network,
}: {
  address: Address
  getTransactionSigner: GetTransactionSigner
  network: Network
}) {
  const { t } = useTranslation('portfolio')
  const { amount, destination, token } = useParams<{ amount: string; destination: string; token: string }>()
  const mint = usePortfolioTokenMint({ address, network, token })
  const navigate = useNavigate()
  const recipients =
    amount && destination && mint
      ? [{ amount: getAmountForMint({ amount, mint }), destination: destination as Address }]
      : undefined
  const confirmMutation = usePortfolioTxSend({ network })
  const prepareQuery = usePortfolioTxPrepare({
    getTransactionSigner,
    input: mint && recipients ? { mint, recipients } : undefined,
    network,
    transactionSignerAddress: address,
  })
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
  assertIsAddress(destination)
  if (prepareQuery.error) {
    return <UiError message={prepareQuery.error} title="Transaction preview failed" />
  }
  return (
    <PortfolioUiModal title={t(($) => $.actionConfirm)}>
      <PortfolioUiSendConfirm
        confirm={async (input) => {
          const signature = await confirmMutation.mutateAsync(input)
          if (signature) {
            await navigate(`/modals/complete/${signature}`)
          }
        }}
        isLoading={confirmMutation.isPending}
        isPreparing={prepareQuery.isLoading}
        mint={mint}
        preparedTransaction={prepareQuery.data}
        recipients={recipients ?? []}
      />
    </PortfolioUiModal>
  )
}
