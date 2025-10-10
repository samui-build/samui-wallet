import { useSettings } from './data-access/settings-provider.js'
import { SettingsUiGroupList } from './ui/settings-ui-group-list.js'

export function SettingsFeatureIndex() {
  const { groups } = useSettings()

  return <SettingsUiGroupList groups={groups} />
}
