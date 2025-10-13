import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { UiBack } from '@workspace/ui/components/ui-back'

import { SettingsUiAccountCreateOptions } from './ui/settings-ui-account-create-options.js'

export function SettingsFeatureAccountCreate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UiBack />
          Create Account
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SettingsUiAccountCreateOptions />
      </CardContent>
    </Card>
  )
}
