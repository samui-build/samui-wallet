import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbPreferenceFindUnique } from '@workspace/db-react/use-db-preference-find-unique-by-key'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'
import { useDbWalletFindMany } from '@workspace/db-react/use-db-wallet-find-many'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useParams } from 'react-router'

import { useDeriveAndCreateWallet } from './data-access/use-derive-and-create-wallet.js'
import { SettingsUiAccountItem } from './ui/settings-ui-account-item.js'
import { SettingsUiWalletTable } from './ui/settings-ui-wallet-table.js'

export function SettingsFeatureAccountDetails() {
  const { accountId } = useParams() as { accountId: string }

  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })
  const {
    data: wallets,
    error: errorWallets,
    isError: isErrorWallets,
    isLoading: isLoadingWallets,
    refetch,
  } = useDbWalletFindMany({ input: { accountId } })
  const { data } = useDbPreferenceFindUnique({ key: 'activeWalletId' })
  const { mutateAsync } = useDbPreferenceUpdateByKey('activeWalletId')

  const deriveWallet = useDeriveAndCreateWallet()

  if (isLoading || isLoadingWallets) {
    return <Spinner />
  }
  if (isError || isErrorWallets) {
    return <UiError message={error || errorWallets} />
  }
  if (!item) {
    return <UiNotFound />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          <SettingsUiAccountItem item={item} />
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SettingsUiWalletTable
          activeId={data?.value ?? null}
          deriveWallet={async () => {
            await deriveWallet.mutateAsync({ index: wallets?.length ?? 0, item })
            await refetch()
          }}
          items={wallets ?? []}
          setActive={async (item) => {
            if (!data?.id) {
              return
            }
            await mutateAsync({ input: { value: item.id } })
          }}
        />
      </CardContent>
    </Card>
  )
}
