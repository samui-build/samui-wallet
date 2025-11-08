import { useDbWalletFindUnique } from '@workspace/db-react/use-db-wallet-find-unique'
import { useDbWalletUpdate } from '@workspace/db-react/use-db-wallet-update'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useNavigate, useParams } from 'react-router'

import { SettingsUiWalletFormUpdate } from './ui/settings-ui-wallet-form-update.tsx'

export function SettingsFeatureWalletUpdate() {
  const navigate = useNavigate()
  const { walletId } = useParams() as { walletId: string }
  const updateMutation = useDbWalletUpdate()
  const { data: item, error, isError, isLoading } = useDbWalletFindUnique({ id: walletId })

  if (isLoading) {
    return <UiLoader />
  }
  if (isError) {
    return <UiError message={error} />
  }
  if (!item) {
    return <UiNotFound />
  }

  return (
    <UiCard backButtonTo={`/settings/wallets/${item.id}`} title="Edit Wallet">
      <SettingsUiWalletFormUpdate
        item={item}
        submit={async (input) =>
          await updateMutation.mutateAsync({ id: item.id, input }).then(() => {
            navigate(`/settings/wallets/${item.id}`)
          })
        }
      />
    </UiCard>
  )
}
