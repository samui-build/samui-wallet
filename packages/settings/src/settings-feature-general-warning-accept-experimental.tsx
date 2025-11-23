import { useSetting } from '@workspace/db-react/use-setting'
import { useTranslation } from '@workspace/i18n'
import { Label } from '@workspace/ui/components/label'
import { Switch } from '@workspace/ui/components/switch'
import { useId } from 'react'

export function SettingsFeatureGeneralWarningAcceptExperimental() {
  const { t } = useTranslation('settings')
  const warningAcceptExperimentalId = useId()
  const [warningAccepted, setWarningAccepted] = useSetting('warningAcceptExperimental')

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={warningAccepted !== 'true'}
        id={warningAcceptExperimentalId}
        onCheckedChange={(checked) => setWarningAccepted(`${!checked}`)}
      />
      <Label htmlFor={warningAcceptExperimentalId}>{t(($) => $.pageGeneralExperimentalSoftware)}</Label>
    </div>
  )
}
