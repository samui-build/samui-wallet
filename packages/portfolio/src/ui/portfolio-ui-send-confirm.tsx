import { useTranslation } from '@workspace/i18n'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useId } from 'react'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import type { PortfolioTxSendInput } from '../data-access/use-portfolio-tx-send.tsx'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiSendConfirm({
  confirm,
  isLoading,
  mint,
  recipients,
}: {
  confirm: (input: PortfolioTxSendInput) => Promise<void>
  isLoading: boolean
  mint: TokenBalance
  recipients: TransferRecipient[]
}) {
  const { t } = useTranslation('portfolio')

  return (
    <div>
      <form>
        <FieldGroup>
          <FieldSet>
            {mint ? <PortfolioUiTokenBalanceItem item={mint} /> : t(($) => $.searchInputSelect)}
            {recipients.map((recipient) => (
              <PortfolioUiSendConfirmDestination key={recipient.destination} recipient={recipient} />
            ))}
          </FieldSet>
          <Field className="flex justify-end" orientation="horizontal">
            <Button
              autoFocus
              disabled={!mint || isLoading}
              onClick={async (e) => {
                e.preventDefault()
                if (!mint) {
                  return
                }
                await confirm({ mint, recipients })
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

function PortfolioUiSendConfirmDestination({ recipient: { amount, destination } }: { recipient: TransferRecipient }) {
  const { t } = useTranslation('portfolio')
  const destinationId = useId()
  const amountId = useId()

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor={destinationId}>{t(($) => $.sendInputDestinationLabel)}</FieldLabel>
        <Input
          defaultValue={destination}
          disabled
          id={destinationId}
          placeholder={t(($) => $.sendInputDestinationPlaceholder)}
          readOnly
          type="text"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={amountId}>{t(($) => $.sendInputAmountLabel)}</FieldLabel>
        <Input
          defaultValue={amount.toString()}
          disabled
          id={amountId}
          min="1"
          placeholder={t(($) => $.sendInputAmountPlaceholder)}
          readOnly
          required
          step="any"
          type="number"
        />
      </Field>
    </FieldGroup>
  )
}
