import { useDbAccountFindUnique } from '@workspace/db-react/use-db-account-find-unique'
import { useDbAccountUpdate } from '@workspace/db-react/use-db-account-update'
import { useDbWalletFindMany } from '@workspace/db-react/use-db-wallet-find-many'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Spinner } from '@workspace/ui/components/spinner'
import { UiBack } from '@workspace/ui/components/ui-back'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'

import { SettingsUiAccountFormUpdate } from './ui/settings-ui-account-form-update.js'
import { SettingsUiWalletTable } from './ui/settings-ui-wallet-table.js'
import { useDeriveAndCreateWallet } from './use-derive-and-create-wallet.js'

export function SettingsFeatureAccountUpdate() {
  const navigate = useNavigate()
  const { accountId } = useParams() as { accountId: string }
  const updateMutation = useDbAccountUpdate()
  const { data: item, error, isError, isLoading } = useDbAccountFindUnique({ id: accountId })
  const {
    data: wallets,
    error: errorWallets,
    isError: isErrorWallets,
    isLoading: isLoadingWallets,
    refetch,
  } = useDbWalletFindMany({ input: { accountId } })
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
          Edit Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SettingsUiAccountFormUpdate
          item={item}
          submit={async (input) => {
            return updateMutation.mutateAsync({ id: item.id, input }).then(() => {
              navigate('/settings/accounts')
            })
          }}
        />
        <SettingsUiWalletTable items={wallets ?? []} />
        <Button
          onClick={async () => {
            await deriveWallet.mutateAsync({ index: wallets ? wallets?.length : 0, item })
            await refetch()
          }}
          variant="outline"
        >
          Derive wallet {wallets ? wallets?.length : 0}
        </Button>
      </CardContent>
    </Card>
  )
}
