import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { UiBack } from '@workspace/ui/components/ui-back'
import { useNavigate } from 'react-router'

import { useDetermineAccountName } from './data-access/use-determine-account-name.js'
import { useGenerateAccountWithWalletMutation } from './data-access/use-generate-account-with-wallet-mutation.js'
import { SettingsUiAccountFormImport } from './ui/settings-ui-account-form-import.js'

export function SettingsFeatureAccountImport() {
  const generateAccountWithWalletMutation = useGenerateAccountWithWalletMutation()
  const navigate = useNavigate()
  const name = useDetermineAccountName()
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Import Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SettingsUiAccountFormImport
          name={name}
          submit={async (input) => {
            generateAccountWithWalletMutation.mutateAsync(input).then((accountId) => {
              navigate(`/settings/accounts/${accountId}`)
            })
          }}
        />
      </CardContent>
    </Card>
  )
}
