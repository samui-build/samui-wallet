import type { AccountInputCreate } from '@workspace/db/dto/account-input-create'

import { useDbAccountCreate } from '@workspace/db-react/use-db-account-create'
import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { derivationPaths } from '@workspace/keypair/derivation-paths'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { UiBack } from '@workspace/ui/components/ui-back'
import { useNavigate } from 'react-router'

export function SettingsFeatureAccountImport() {
  const createMutation = useDbAccountCreate()
  const navigate = useNavigate()
  const items = useDbAccountLive()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Import Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <Button
          onClick={() => {
            const input: AccountInputCreate = {
              derivationPath: derivationPaths.default,
              mnemonic: 'pill tomorrow foster begin walnut borrow virtual kick shift mutual shoe scatter',
              name: `Account ${items.length + 1}`,
              secret: 'password',
            }
            createMutation.mutateAsync({ input }).then(() => {
              navigate('/settings/accounts')
            })
          }}
        >
          IMPORT
        </Button>
      </CardContent>
    </Card>
  )
}
