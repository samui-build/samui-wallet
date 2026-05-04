import { zodResolver } from '@hookform/resolvers/zod'
import { tryCatch } from '@workspace/core/try-catch'
import type { Account } from '@workspace/db/account/account'
import type { BookmarkAccount } from '@workspace/db/bookmark-account/bookmark-account'
import { solanaAddressSchema } from '@workspace/db/solana/solana-address-schema'
import { useBookmarkAccountLive } from '@workspace/db-react/use-bookmark-account-live'
import { useWalletLive } from '@workspace/db-react/use-wallet-live'
import { useTranslation } from '@workspace/i18n'
import { Badge } from '@workspace/ui/components/badge'
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

type DestinationAccount = {
  address: string
  id: string
  isSource: boolean
  label: string
}

function compareDestinationAccounts(destinationAccountA: DestinationAccount, destinationAccountB: DestinationAccount) {
  return (
    destinationAccountA.label.localeCompare(destinationAccountB.label) ||
    destinationAccountA.address.localeCompare(destinationAccountB.address)
  )
}

function filterDestinationAccount(destinationAccount: DestinationAccount, query: string): boolean {
  const normalizedQuery = query.toLocaleLowerCase()

  return (
    destinationAccount.label.toLocaleLowerCase().includes(normalizedQuery) ||
    destinationAccount.address.toLocaleLowerCase().includes(normalizedQuery)
  )
}

function getBookmarkAccountLabel(bookmarkAccount: BookmarkAccount): string {
  return bookmarkAccount.label?.trim() || ellipsify(bookmarkAccount.address, 8, '...')
}

function shouldOpenDestinationSuggestions(destinationAccounts: DestinationAccount[], value: string): boolean {
  return (
    !value ||
    !solanaAddressSchema.safeParse(value).success ||
    destinationAccounts.some((item) => filterDestinationAccount(item, value))
  )
}

function uniqueAccounts(accounts: Account[] = []): Account[] {
  return Array.from(new Map(accounts.map((account) => [account.publicKey, account])).values())
}

export function PortfolioUiSendDestination({
  isLoading,
  mint,
  sourceAddress,
  submit,
}: {
  isLoading: boolean
  mint: TokenBalance
  sourceAddress: string
  submit: (input: { destination: string }) => Promise<void>
}) {
  const { t } = useTranslation('portfolio')
  const bookmarkAccountsLive = useBookmarkAccountLive()
  const destinationId = useId()
  const wallets = useWalletLive()
  const bookmarkDestinationAccounts = useMemo<DestinationAccount[]>(
    () =>
      [...bookmarkAccountsLive]
        .map((bookmarkAccount) => ({
          address: bookmarkAccount.address,
          id: `bookmark-${bookmarkAccount.id}`,
          isSource: false,
          label: getBookmarkAccountLabel(bookmarkAccount),
        }))
        .sort(compareDestinationAccounts),
    [bookmarkAccountsLive],
  )
  const bookmarkAccountGroups = useMemo<UiGroupedComboboxInputGroup<DestinationAccount>[]>(
    () => [{ items: bookmarkDestinationAccounts, label: t(($) => $.sendInputDestinationBookmarksGroupLabel) }],
    [bookmarkDestinationAccounts, t],
  )
  const walletAccountGroups = useMemo<UiGroupedComboboxInputGroup<DestinationAccount>[]>(
    () =>
      wallets
        .map((wallet) => ({
          items: uniqueAccounts(wallet.accounts ?? [])
            .map((account) => ({
              address: account.publicKey,
              id: `account-${account.id}`,
              isSource: account.publicKey === sourceAddress,
              label: account.name,
            }))
            .sort(compareDestinationAccounts),
          label: wallet.name,
        }))
        .filter((group) => group.items.length)
        .sort((groupA, groupB) => groupA.label.localeCompare(groupB.label)),
    [sourceAddress, wallets],
  )
  const destinationAccountGroups = useMemo(
    () => bookmarkAccountGroups.concat(walletAccountGroups),
    [bookmarkAccountGroups, walletAccountGroups],
  )
  const destinationAccounts = useMemo(
    () => destinationAccountGroups.flatMap((group) => group.items),
    [destinationAccountGroups],
  )
  const formSchema = z.object({
    destination: z.string().refine((value) => !value || solanaAddressSchema.safeParse(value).success, {
      message: t(($) => $.sendInputDestinationInvalid),
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
                          filter={filterDestinationAccount}
                          getItemKey={(destinationAccount) => destinationAccount.id}
                          getItemLabel={(destinationAccount) => (
                            <>
                              {destinationAccount.label}
                              {destinationAccount.isSource ? (
                                <Badge className="ml-2 align-middle" variant="secondary">
                                  {t(($) => $.sendDestinationFromBadge)}
                                </Badge>
                              ) : null}
                            </>
                          )}
                          getItemValue={(destinationAccount) => destinationAccount.address}
                          groups={destinationAccountGroups}
                          id={destinationId}
                          inputRef={field.ref}
                          name={field.name}
                          onBlur={field.onBlur}
                          onValueChange={field.onChange}
                          placeholder={t(($) => $.sendInputDestinationPlaceholder)}
                          shouldOpenSuggestions={(value) =>
                            shouldOpenDestinationSuggestions(destinationAccounts, value)
                          }
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
