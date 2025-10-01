import type { SettingsGroup } from '../data-access/settings-group.js'

export function SettingsUiGroupHeaderTitle({ group: { name } }: { group: SettingsGroup }) {
  return <span className="text-lg font-bold">{name}</span>
}
