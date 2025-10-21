import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'

import { usePreference } from './settings-feature-general.js'

export function SettingsFeatureGeneralWarningAcceptExperimental() {
  const { update, value } = usePreference('warningAcceptExperimental')

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={value !== 'true'}
        id="warning-accept-experimental"
        onCheckedChange={(checked) => update(checked ? 'false' : 'true')}
      />
      <Label htmlFor="warning-accept-experimental">Show warning about experimental software</Label>
    </div>
  )
}
