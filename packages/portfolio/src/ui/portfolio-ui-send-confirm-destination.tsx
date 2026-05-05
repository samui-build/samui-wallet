import { formatBalance } from '@workspace/explorer/data-access/format-balance'
import { useTranslation } from '@workspace/i18n'
import type { TransferRecipient } from '@workspace/solana-client/transfer-recipient'
import { Field, FieldGroup, FieldLabel } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { useId } from 'react'
import type { TokenBalance } from '../data-access/use-get-token-balances.ts'

export function PortfolioUiSendConfirmDestination({
  mint,
  recipient: { amount, destination },
}: {
  mint: TokenBalance
  recipient: TransferRecipient
}) {
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
          defaultValue={formatBalance({ balance: amount, decimals: mint.decimals })}
          disabled
          id={amountId}
          placeholder={t(($) => $.sendInputAmountPlaceholder)}
          readOnly
          type="text"
        />
      </Field>
    </FieldGroup>
  )
}
