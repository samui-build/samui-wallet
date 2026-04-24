import { zodResolver } from '@hookform/resolvers/zod'
import { tryCatch } from '@workspace/core/try-catch'
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
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

export function PortfolioUiSendDestination({
  mint,
  isLoading,
  submit,
}: {
  mint: TokenBalance
  isLoading: boolean
  submit: (input: { destination: string }) => Promise<void>
}) {
  const { t } = useTranslation('portfolio')
  const destinationId = useId()
  const formSchema = z.object({
    destination: z.string().refine((value) => !value || solanaAddressSchema.safeParse(value).success, {
      message: 'Invalid Solana address',
    }),
  })

  type PortfolioUiSendMintInput = z.infer<typeof formSchema>

  const form = useForm({
    defaultValues: {
      destination: '',
    },
    mode: 'all',
    resolver: zodResolver(formSchema),
  })
  const destination = form.watch('destination')

  async function handleSubmit(data: PortfolioUiSendMintInput) {
    if (!data.destination) {
      return
    }
    const { error: submitError } = await tryCatch(submit({ destination: data.destination }))
    if (submitError) {
      return
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FieldGroup>
            <FieldSet>
              <PortfolioUiTokenBalanceItem item={mint} />

              <FieldGroup>
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor={destinationId}>{t(($) => $.sendInputDestinationLabel)}</FieldLabel>
                        <Input
                          {...field}
                          autoComplete="off"
                          autoFocus
                          id={destinationId}
                          placeholder={t(($) => $.sendInputDestinationPlaceholder)}
                          type="text"
                          value={field.value.toString()}
                        />
                      </Field>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FieldGroup>
            </FieldSet>

            <Field className="flex justify-end" orientation="horizontal">
              <Button disabled={!destination || !form.formState.isValid || isLoading} type="submit">
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
