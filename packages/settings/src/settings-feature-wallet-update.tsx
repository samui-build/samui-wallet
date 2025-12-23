import { useWalletFindUnique } from '@workspace/db-react/use-wallet-find-unique'
import { useWalletUpdate } from '@workspace/db-react/use-wallet-update'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { UiNotFound } from '@workspace/ui/components/ui-not-found'
import { useLocation, useNavigate, useParams } from 'react-router'
import { SettingsUiWalletFormUpdate } from './ui/settings-ui-wallet-form-update.tsx'

export function SettingsFeatureWalletUpdate() {
  const { t } = useTranslation('settings')
  const navigate = useNavigate()
  const { walletId } = useParams<{ walletId: string }>()
  if (!walletId) {
    throw new Error('Parameter walletId is required')
  }

  const { state } = useLocation()
  const from = state?.from ?? `/settings/wallets/${walletId}`
  const updateMutation = useWalletUpdate()
  const wallet = useWalletFindUnique({ id: walletId })

  if (!wallet) {
    return <UiNotFound />
  }

  return (
    <UiCard backButtonTo={from} title={t(($) => $.walletPageEditTitle)}>
      <SettingsUiWalletFormUpdate
        item={wallet}
        submit={async (input) =>
          await updateMutation.mutateAsync({ id: wallet.id, input }).then(() => {
            navigate(from)
          })
        }
      />
    </UiCard>
  )
}
