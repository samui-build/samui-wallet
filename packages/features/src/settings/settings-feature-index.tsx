import { SettingsUiGroupList } from './ui/settings-ui-group-list.js'
import { useSettings } from './data-access/settings-provider.js'

export function SettingsFeatureIndex() {
  const { groups } = useSettings()

  return <SettingsUiGroupList groups={groups} />
}
