import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { useId } from 'react'

export function SettingsFeatureGeneralDeveloperModeEnable() {
  const { t } = useTranslation('settings')
  const enableDeveloperModeId = useId()
  const [developerModeEnabled, setDeveloperModeEnabled] = useSetting('developerModeEnabled')

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={developerModeEnabled === 'true'}
        id={enableDeveloperModeId}
        onCheckedChange={(checked) => setDeveloperModeEnabled(`${checked}`)}
      />
      <Label htmlFor={enableDeveloperModeId}>{t(($) => $.pageGeneralDeveloperMode)}</Label>
    </div>
  )
}
