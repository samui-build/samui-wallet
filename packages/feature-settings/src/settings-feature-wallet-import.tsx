import { useWalletDetermineName } from '@workspace/db-react/use-wallet-determine-name'
import { useWalletGenerateWithAccount } from '@workspace/db-react/use-wallet-generate-with-account'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useVaultUnlockDialog } from '@workspace/vault-react/vault-unlock-provider'
import { useNavigate } from 'react-router'
import { SettingsUiWalletFormImport } from './ui/settings-ui-wallet-form-import.tsx'

export function SettingsFeatureWalletImport() {
  const { t } = useTranslation('settings')
  const generateWalletWithAccountMutation = useWalletGenerateWithAccount()
  const navigate = useNavigate()
  const name = useWalletDetermineName()
  const { requestUnlock } = useVaultUnlockDialog()
  return (
    <UiCard backButtonTo="/settings/wallets/create" title={t(($) => $.walletPageImportTitle)}>
      <SettingsUiWalletFormImport
        name={name}
        submit={async (input, redirect) => {
          const unlocked = await requestUnlock({ mode: 'password', reason: 'createWallet' })
          if (!unlocked) {
            return
          }
          await generateWalletWithAccountMutation.mutateAsync(input).then(async (walletId) => {
            if (redirect) {
              await navigate(`/settings/wallets/${walletId}`)
            }
          })
        }}
      />
    </UiCard>
  )
}
