import type { SettingsGroup } from '../data-access/settings-group.js'

export function SettingsUiGroupHeaderIcon({ group: { icon: Icon } }: { group: SettingsGroup }) {
  return <Icon className="h-6 w-6" />
}
