import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useWalletUpdate } from '@workspace/db-react/use-wallet-update'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiError } from '@workspace/ui/components/ui-error'
import { UiLoader } from '@workspace/ui/components/ui-loader'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useLocation, useNavigate, useParams } from 'react-router'
import { SettingsUiWalletFormUpdate } from './ui/settings-ui-wallet-form-update.tsx'

export function SettingsFeatureWalletUpdate() {
  const { t } = useTranslation('settings')
  const navigate = useNavigate()
  const { walletId } = useParams() as { walletId: string }
  const { state } = useLocation()
  const from = state?.from ?? `/settings/wallets/${walletId}`
  const updateMutation = useWalletUpdate()
  const { data: item, error, isError, isLoading } = useWalletFindUnique({ id: walletId })

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
    <UiCard backButtonTo={from} title={t(($) => $.walletPageEditTitle)}>
      <SettingsUiWalletFormUpdate
        item={item}
        submit={async (input) =>
          await updateMutation.mutateAsync({ id: item.id, input }).then(() => {
            navigate(from)
          })
        }
      />
    </UiCard>
  )
}
