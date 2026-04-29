import { zodResolver } from '@hookform/resolvers/zod'
import { tryCatch } from '@workspace/core/try-catch'
import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { useBookmarkAccountLive } from '@workspace/db-react/use-bookmark-account-live'
import { useTranslation } from '@workspace/i18n'
import { Button } from '@workspace/ui/components/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '@workspace/ui/components/field'
import { Form, FormField, FormItem, FormMessage } from '@workspace/ui/components/form'
import type { UiGroupedComboboxInputGroup } from '@workspace/ui/components/ui-grouped-combobox-input'
import { UiGroupedComboboxInput } from '@workspace/ui/components/ui-grouped-combobox-input'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { ellipsify } from '@workspace/ui/lib/ellipsify'
import { useId, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { TokenBalance } from '../data-access/use-get-token-metadata.ts'
import { PortfolioUiTokenBalanceItem } from './portfolio-ui-token-balance-item.tsx'

function compareBookmarkAccounts(bookmarkAccountA: BookmarkAccount, bookmarkAccountB: BookmarkAccount): number {
  return (
    getBookmarkAccountLabel(bookmarkAccountA).localeCompare(getBookmarkAccountLabel(bookmarkAccountB)) ||
    bookmarkAccountA.address.localeCompare(bookmarkAccountB.address)
  )
}

function filterBookmarkAccount(bookmarkAccount: BookmarkAccount, query: string): boolean {
  const normalizedQuery = query.toLocaleLowerCase()

  return (
    getBookmarkAccountLabel(bookmarkAccount).toLocaleLowerCase().includes(normalizedQuery) ||
    bookmarkAccount.address.toLocaleLowerCase().includes(normalizedQuery)
  )
}

function getBookmarkAccountLabel(bookmarkAccount: BookmarkAccount): string {
  return bookmarkAccount.label?.trim() || ellipsify(bookmarkAccount.address, 8, '...')
}

function shouldOpenBookmarkSuggestions(bookmarkAccounts: BookmarkAccount[], value: string): boolean {
  return (
    !value ||
    !solanaAddressSchema.safeParse(value).success ||
    bookmarkAccounts.some((item) => filterBookmarkAccount(item, value))
  )
}

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
  const bookmarkAccountsLive = useBookmarkAccountLive()
  const destinationId = useId()
  const bookmarkAccounts = useMemo(
    () => [...bookmarkAccountsLive].sort(compareBookmarkAccounts),
    [bookmarkAccountsLive],
  )
  const bookmarkAccountGroups = useMemo<UiGroupedComboboxInputGroup<BookmarkAccount>[]>(
    () => [{ items: bookmarkAccounts, label: t(($) => $.sendInputDestinationBookmarksGroupLabel) }],
    [bookmarkAccounts, t],
  )
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
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Field>
                        <FieldLabel htmlFor={destinationId}>{t(($) => $.sendInputDestinationLabel)}</FieldLabel>
                        <UiGroupedComboboxInput
                          autoFocus
                          contentClassName="w-[calc(var(--anchor-width)-5rem)]"
                          disabledMessage={t(($) => $.sendInputDestinationBookmarksEmpty)}
                          emptyMessage={t(($) => $.sendInputDestinationBookmarksNotFound)}
                          filter={filterBookmarkAccount}
                          getItemKey={(bookmarkAccount) => bookmarkAccount.id}
                          getItemLabel={getBookmarkAccountLabel}
                          getItemValue={(bookmarkAccount) => bookmarkAccount.address}
                          groups={bookmarkAccountGroups}
                          id={destinationId}
                          inputRef={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          onValueChange={field.onChange}
                          placeholder={t(($) => $.sendInputDestinationPlaceholder)}
                          shouldOpenSuggestions={(value) => shouldOpenBookmarkSuggestions(bookmarkAccounts, value)}
                          sideOffset={fieldState.error ? 34 : 6}
                          value={field.value}
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
