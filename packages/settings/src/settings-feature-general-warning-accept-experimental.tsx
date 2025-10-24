import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'

export function SettingsFeatureGeneralWarningAcceptExperimental() {
  const [warningAccepted, setWarningAccepted] = useDbPreference('warningAcceptExperimental')

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={warningAccepted !== 'true'}
        id="warning-accept-experimental"
        onCheckedChange={(checked) => setWarningAccepted(`${!checked}`)}
      />
      <Label htmlFor="warning-accept-experimental">Show warning about experimental software</Label>
    </div>
  )
}
