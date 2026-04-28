import { useTranslation } from '@workspace/i18n'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldSet } from '@workspace/ui/components/field'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import type { PortfolioPreparedTransaction } from '../data-access/use-portfolio-tx-prepare.tsx'
import { PortfolioUiSendConfirmChanges } from './portfolio-ui-send-confirm-changes.tsx'
import { PortfolioUiSendConfirmDestination } from './portfolio-ui-send-confirm-destination.tsx'
import { PortfolioUiSendConfirmTransaction } from './portfolio-ui-send-confirm-transaction.tsx'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiSendConfirm({
  confirm,
  isLoading,
  isPreparing,
  mint,
  preparedTransaction,
  recipients,
}: {
  confirm: (input: PortfolioPreparedTransaction) => Promise<void>
  isLoading: boolean
  isPreparing: boolean
  mint: TokenBalance
  preparedTransaction: PortfolioPreparedTransaction | undefined
  recipients: TransferRecipient[]
}) {
  const { t } = useTranslation('portfolio')

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
            <PortfolioUiSendConfirmChanges
              mint={mint}
              preparedTransaction={preparedTransaction}
              recipients={recipients}
            />
            <PortfolioUiSendConfirmTransaction isPreparing={isPreparing} preparedTransaction={preparedTransaction} />
          </FieldSet>
          <Field className="flex justify-end" orientation="horizontal">
            <Button
              autoFocus
              disabled={!mint || !preparedTransaction || isLoading || isPreparing}
              onClick={async (e) => {
                e.preventDefault()
                if (!mint || !preparedTransaction) {
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
