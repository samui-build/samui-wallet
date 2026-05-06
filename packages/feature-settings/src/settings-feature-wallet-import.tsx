import { useWalletDetermineName } from '@workspace/db-react/use-wallet-determine-name'
import { useWalletGenerateWithAccount } from '@workspace/db-react/use-wallet-generate-with-account'
import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'
import { SettingsUiWalletFormImport } from './ui/settings-ui-wallet-form-import.tsx'

export function SettingsFeatureWalletImport() {
  const { t } = useTranslation('settings')
  const generateWalletWithAccountMutation = useWalletGenerateWithAccount()
  const navigate = useNavigate()
  const name = useWalletDetermineName()
  return (
    <UiCard backButtonTo="/settings/wallets/create" title={t(($) => $.walletPageImportTitle)}>
      <SettingsUiWalletFormImport
        name={name}
        submit={async (input, redirect) => {
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
