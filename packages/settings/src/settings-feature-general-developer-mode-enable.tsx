import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { useId } from 'react'

export function SettingsFeatureGeneralDeveloperModeEnable() {
  const enableDeveloperModeId = useId()
  const [enabled, setEnabled] = useDbSetting('developerModeEnabled')

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={enabled === 'true'}
        id={enableDeveloperModeId}
        onCheckedChange={(checked) => setEnabled(`${checked}`)}
      />
      <Label htmlFor={enableDeveloperModeId}>Enable developer mode</Label>
    </div>
  )
}
