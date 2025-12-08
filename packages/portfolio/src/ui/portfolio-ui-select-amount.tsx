import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from '@workspace/i18n'
import { NATIVE_MINT } from '@workspace/solana-client/constants'
import { maxAvailableSolAmount } from '@workspace/solana-client/max-available-sol-amount'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { Form, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiSelectAmount({
  destination,
  mint,
  isLoading,
  submit,
}: {
  destination: string
  mint: TokenBalance
  isLoading: boolean
  submit: (input: { amount: string }) => Promise<void>
}) {
  const { t } = useTranslation('portfolio')
  const destinationId = useId()
  const amountId = useId()
  const max = mint.mint === NATIVE_MINT ? maxAvailableSolAmount(mint.balance, mint.balance) : mint.balance
  const maxAmount = Number(max) / 10 ** mint.decimals
  const formSchema = z.object({
    amount: z
      .number()
      .positive({ message: 'Amount must be greater than 0' })
      .max(Number(maxAmount), { message: 'Amount exceeds available balance' }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: { amount: 0 },
    mode: 'all',
    resolver: zodResolver(formSchema),
  })

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((input) => submit({ amount: input['amount'].toString() }))}>
          <FieldGroup>
            <FieldSet>
              <PortfolioUiTokenBalanceItem item={mint} />
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

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor={amountId}>{t(($) => $.sendInputAmountLabel)}</FieldLabel>
                        <div className="flex gap-2">
                          <Input
                            {...field}
                            autoComplete="off"
                            autoFocus
                            id={amountId}
                            min="0"
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            placeholder={t(($) => $.sendInputAmountPlaceholder)}
                            step="any"
                            type="number"
                            value={field.value}
                          />
                          <Button onClick={() => field.onChange(maxAmount)} type="button" variant="outline">
                            Max
                          </Button>
                        </div>
                      </Field>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Field className="flex justify-end" orientation="horizontal">
              <Button disabled={!form.formState.isValid || isLoading} type="submit">
                {isLoading ? <UiLoader className="size-4" /> : null}
                {t(($) => $.actionSend)}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </Form>
    </div>
  )
}
