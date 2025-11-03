import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'

import { useDetermineAccountName } from './data-access/use-determine-account-name.tsx'
import { useGenerateAccountWithWalletMutation } from './data-access/use-generate-account-with-wallet-mutation.tsx'
import { SettingsUiAccountFormImport } from './ui/settings-ui-account-form-import.tsx'

export function SettingsFeatureAccountImport() {
  const generateAccountWithWalletMutation = useGenerateAccountWithWalletMutation()
  const navigate = useNavigate()
  const name = useDetermineAccountName()
  return (
    <UiCard
      title={
        <div className="flex items-center gap-2">
          <UiBack />
          Import Account
        </div>
      }
    >
      <SettingsUiAccountFormImport
        name={name}
        submit={async (input, redirect) => {
          generateAccountWithWalletMutation.mutateAsync(input).then((accountId) => {
            if (redirect) {
              navigate(`/settings/accounts/${accountId}`)
            }
          })
        }}
      />
    </UiCard>
  )
}
