import { type Address, assertIsAddress } from '@solana/kit'
import type { Network } from '@workspace/db/network/network'
import { useTranslation } from '@workspace/i18n'
import type { GetTransactionSigner } from '@workspace/solana-client/transaction-signer'
import { useSimulatePreparedTransaction } from '@workspace/solana-client-react/use-simulate-prepared-transaction'
import { UiError } from '@workspace/ui/components/ui-error'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useNavigate, useParams } from 'react-router'
import { getAmountForMint } from './data-access/get-amount-for-mint.ts'
import { usePortfolioTokenMint } from './data-access/use-portfolio-token-mint.tsx'
import { type PortfolioPreparedTransaction, usePortfolioTxPrepare } from './data-access/use-portfolio-tx-prepare.tsx'
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
  const simulationQuery = useSimulatePreparedTransaction({
    input: prepareQuery.data,
    network,
  })
  const confirmSimulation =
    isMatchingPreparedTransaction(confirmMutation.variables, prepareQuery.data) &&
    confirmMutation.data?.simulation.status === 'failure'
      ? confirmMutation.data.simulation
      : undefined
  const simulation = confirmSimulation ?? simulationQuery.data

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
          const result = await confirmMutation.mutateAsync(input)
          if (result?.signature) {
            await navigate(`/modals/complete/${result.signature}`)
          }
          return result
        }}
        isLoading={confirmMutation.isPending}
        isPreparing={prepareQuery.isLoading}
        isSimulating={simulationQuery.isFetching || simulationQuery.isLoading}
        mint={mint}
        preparedTransaction={prepareQuery.data}
        recipients={recipients ?? []}
        simulation={simulation}
        simulationError={simulationQuery.error}
      />
    </PortfolioUiModal>
  )
}

function isMatchingPreparedTransaction(
  transactionA: PortfolioPreparedTransaction | undefined,
  transactionB: PortfolioPreparedTransaction | undefined,
) {
  if (!transactionA || !transactionB) {
    return false
  }

  return (
    transactionA.mint.mint === transactionB.mint.mint &&
    transactionA.recipients.length === transactionB.recipients.length &&
    transactionA.recipients.every((recipient, index) => {
      const otherRecipient = transactionB.recipients[index]

      return otherRecipient?.amount === recipient.amount && otherRecipient.destination === recipient.destination
    }) &&
    transactionA.transactionSigner.address === transactionB.transactionSigner.address
  )
}
