import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { useId } from 'react'

export function SettingsFeatureGeneralWarningAcceptExperimental() {
  const warningAcceptExperimentalId = useId()
  const [warningAccepted, setWarningAccepted] = useDbPreference('warningAcceptExperimental')

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={warningAccepted !== 'true'}
        id={warningAcceptExperimentalId}
        onCheckedChange={(checked) => setWarningAccepted(`${!checked}`)}
      />
      <Label htmlFor={warningAcceptExperimentalId}>Show warning about experimental software</Label>
    </div>
  )
}
