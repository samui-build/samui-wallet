import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'

export function SettingsFeatureGeneralApiEndpoint() {
  const [apiEndpoint, setApiEndpoint] = useDbPreference('apiEndpoint')

  return (
    <div className="space-y-2">
      <Label htmlFor="api-endpoint">API Endpoint</Label>
      <Input
        id="api-endpoint"
        onChange={(e) => setApiEndpoint(e.target.value)}
        placeholder="https://api.samui.build"
        value={apiEndpoint ?? ''}
      />
    </div>
  )
}
