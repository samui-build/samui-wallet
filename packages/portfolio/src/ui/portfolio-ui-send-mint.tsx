import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { Input } from '@workspace/ui/components/input'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useId, useState } from 'react'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiSendMint({
  mint,
  isLoading,
  send,
}: {
  mint: TokenBalance
  isLoading: boolean
  send: (input: { amount: string; destination: string; mint: TokenBalance }) => Promise<void>
}) {
  const { t } = useTranslation('portfolio')
  const destinationId = useId()
  const amountId = useId()
  const [amount, setAmount] = useState('')
  const [destination, setDestination] = useState('')

  return (
    <div className="space-y-6">
      <form>
        <FieldGroup>
          <FieldSet>
            {mint ? <PortfolioUiTokenBalanceItem item={mint} /> : t(($) => $.searchInputSelect)}

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={destinationId}>{t(($) => $.sendInputDestinationLabel)}</FieldLabel>
                <Input
                  id={destinationId}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t(($) => $.sendInputDestinationPlaceholder)}
                  type="text"
                  value={destination}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={amountId}>{t(($) => $.sendInputAmountLabel)}</FieldLabel>
                <Input
                  id={amountId}
                  min="1"
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t(($) => $.sendInputAmountPlaceholder)}
                  required
                  step="any"
                  type="number"
                  value={amount}
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field className="flex justify-end" orientation="horizontal">
            <Button
              disabled={!mint || !amount || !destination || isLoading}
              onClick={async (e) => {
                e.preventDefault()
                if (!mint) {
                  return
                }
                await send({ amount, destination, mint })
              }}
              type="button"
            >
              {isLoading ? <UiLoader className="size-4" /> : null}
              {t(($) => $.actionSend)}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
