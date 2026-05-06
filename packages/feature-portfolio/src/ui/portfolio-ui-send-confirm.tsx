import { useTranslation } from '@workspace/i18n'
import { formatSimulationFailure } from '@workspace/solana-client/format-simulation-failure'
import type { SendSimulatedPreparedTransactionResult } from '@workspace/solana-client/send-prepared-transaction'
import type { SimulatePreparedTransactionResult } from '@workspace/solana-client/simulate-prepared-transaction'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { Alert, AlertDescription, AlertTitle } from '@workspace/ui/components/alert'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldSet } from '@workspace/ui/components/field'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiPre } from '@workspace/ui/components/ui-pre'
import type { TokenBalance } from '../data-access/use-get-token-balances.ts'
import type { PortfolioPreparedTransaction } from '../data-access/use-portfolio-tx-prepare.tsx'
import { PortfolioUiSendConfirmChanges } from './portfolio-ui-send-confirm-changes.tsx'
import { PortfolioUiSendConfirmDestination } from './portfolio-ui-send-confirm-destination.tsx'
import { PortfolioUiSendConfirmTransaction } from './portfolio-ui-send-confirm-transaction.tsx'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiSendConfirm({
  confirm,
  isLoading,
  isPreparing,
  isSimulating,
  mint,
  preparedTransaction,
  recipients,
  simulation,
  simulationError,
}: {
  confirm: (input: PortfolioPreparedTransaction) => Promise<SendSimulatedPreparedTransactionResult | undefined>
  isLoading: boolean
  isPreparing: boolean
  isSimulating: boolean
  mint: TokenBalance
  preparedTransaction: PortfolioPreparedTransaction | undefined
  recipients: TransferRecipient[]
  simulation: SimulatePreparedTransactionResult | undefined
  simulationError: Error | null
}) {
  const { t } = useTranslation('portfolio')
  const canConfirm =
    !!preparedTransaction &&
    !isLoading &&
    !isPreparing &&
    !isSimulating &&
    !simulationError &&
    simulation?.status === 'success'

  return (
    <div>
      <form>
        <FieldGroup>
          <FieldSet>
            {mint ? <PortfolioUiTokenBalanceItem item={mint} /> : t(($) => $.searchInputSelect)}
            {recipients.map((recipient, index) => (
              <PortfolioUiSendConfirmDestination
                key={`${recipient.destination}-${recipient.amount.toString()}-${index}`}
                mint={mint}
                recipient={recipient}
              />
            ))}
            {isSimulating ? (
              <div className="flex items-center gap-2 rounded-md border p-3 text-muted-foreground text-sm">
                <UiLoader className="size-4" />
                {t(($) => $.sendConfirmSimulatingTransaction)}
              </div>
            ) : null}
            {simulationError || simulation?.status === 'failure' ? (
              <Alert variant="destructive">
                <AlertTitle>{t(($) => $.sendConfirmSimulationFailed)}</AlertTitle>
                <AlertDescription>
                  <div>{t(($) => $.sendConfirmSimulationFailedDescription)}</div>
                  <UiPre>
                    {formatSimulationFailure(
                      simulationError ?? simulation?.error,
                      simulation?.status === 'failure' ? simulation.logs : [],
                    )}
                  </UiPre>
                </AlertDescription>
              </Alert>
            ) : null}
            {!isSimulating && !simulationError && simulation?.status === 'success' ? (
              <PortfolioUiSendConfirmChanges mint={mint} simulation={simulation} />
            ) : null}
            <PortfolioUiSendConfirmTransaction isPreparing={isPreparing} preparedTransaction={preparedTransaction} />
          </FieldSet>
          <Field className="flex justify-end" orientation="horizontal">
            <Button
              autoFocus
              disabled={!mint || !canConfirm}
              onClick={async (e) => {
                e.preventDefault()
                if (!mint || !canConfirm) {
                  return
                }
                await confirm(preparedTransaction)
              }}
              type="button"
            >
              {isLoading ? <UiLoader className="size-4" /> : null}
              {t(($) => $.actionConfirm)}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
