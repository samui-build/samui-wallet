import { UiBack } from '@workspace/ui/components/ui-back'
import { UiCard } from '@workspace/ui/components/ui-card'
import { useNavigate } from 'react-router'

import { useDetermineAccountName } from './data-access/use-determine-account-name.js'
import { useGenerateAccountWithWalletMutation } from './data-access/use-generate-account-with-wallet-mutation.js'
import { SettingsUiAccountFormImport } from './ui/settings-ui-account-form-import.js'

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
        submit={async (input) => {
          generateAccountWithWalletMutation.mutateAsync(input).then((accountId) => {
            navigate(`/settings/accounts/${accountId}`)
          })
        }}
      />
    </UiCard>
  )
}
