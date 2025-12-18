import { zodResolver } from '@hookform/resolvers/zod'
import type { Address } from '@solana/kit'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { Form, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'
import { Input } from '@workspace/ui/components/input'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function PortfolioUiBurn({
  account,
  amount,
  isLoading,
  confirm,
}: {
  account: Address
  amount: string
  isLoading: boolean
  confirm: (input: { account: Address; amount: string }) => Promise<void>
}) {
  const formSchema = z.object({
    account: solanaAddressSchema,
    amount: z
      .number()
      .positive({ message: 'Amount must be greater than 0' })
      .max(Number(amount), { message: `Amount exceeds available balance ${amount}` }),
  })

  type PortfolioUiSendMintInput = z.infer<typeof formSchema>
  const form = useForm({
    defaultValues: {
      account,
      amount: Number(amount),
    },
    resolver: zodResolver(formSchema),
  })
  const { t } = useTranslation('portfolio')
  const accountId = useId()
  const amountId = useId()
  async function handleSubmit(data: PortfolioUiSendMintInput) {
    await confirm({ account: data.account, amount: data.amount.toString() })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FieldSet>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor={accountId}>{t(($) => $.sendInputAccountLabel)}</FieldLabel>
                        <Input
                          autoComplete="off"
                          autoFocus
                          defaultValue={field.value}
                          disabled
                          id={accountId}
                          readOnly
                          type="text"
                        />
                      </Field>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor={amountId}>{t(($) => $.sendInputAccountLabel)}</FieldLabel>
                        <Input
                          {...field}
                          autoComplete="off"
                          className="w-[200px]"
                          min="0"
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                          placeholder={t(($) => $.sendInputAmountPlaceholder)}
                          step="any"
                          type="number"
                        />
                      </Field>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>
            <Field className="flex justify-end" orientation="horizontal">
              <Button disabled={isLoading} type="submit">
                {isLoading ? <UiLoader className="size-4" /> : null}
                {t(($) => $.actionSend)}
              </Button>
            </Field>{' '}
          </FieldGroup>
        </form>
      </Form>
    </div>
  )
}
