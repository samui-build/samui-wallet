import { useTranslation } from '@workspace/i18n'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'
import { useDetermineWalletName } from './data-access/use-determine-wallet-name.tsx'
import { useGenerateWalletWithAccountMutation } from './data-access/use-generate-wallet-with-account-mutation.tsx'
import { SettingsUiWalletFormImport } from './ui/settings-ui-wallet-form-import.tsx'

export function SettingsFeatureWalletImport() {
  const { t } = useTranslation('settings')
  const generateWalletWithAccountMutation = useGenerateWalletWithAccountMutation()
  const navigate = useNavigate()
  const name = useDetermineWalletName()
  return (
    <UiCard backButtonTo="/settings/wallets/create" title={t(($) => $.walletPageImportTitle)}>
      <SettingsUiWalletFormImport
        name={name}
        submit={async (input, redirect) => {
          generateWalletWithAccountMutation.mutateAsync(input).then((walletId) => {
            if (redirect) {
              navigate(`/settings/wallets/${walletId}`)
            }
          })
        }}
      />
    </UiCard>
  )
}
