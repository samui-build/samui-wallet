import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useTranslation } from '@workspace/i18n'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import { useId } from 'react'

export function SettingsFeatureGeneralApiEndpoint() {
  const { t } = useTranslation('settings')
  const apiEndpointId = useId()
  const [apiEndpoint, setApiEndpoint] = useDbSetting('apiEndpoint')

  return (
    <div className="space-y-2">
      <Label htmlFor={apiEndpointId}>{t(($) => $.pageGeneralApiEndpoint)}</Label>
      <Input
        id={apiEndpointId}
        onChange={(e) => setApiEndpoint(e.target.value)}
        placeholder="https://api.samui.build"
        value={apiEndpoint ?? ''}
      />
    </div>
  )
}
