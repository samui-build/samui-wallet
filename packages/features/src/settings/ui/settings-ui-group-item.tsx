import { SettingsGroup } from '../data-access/settings-group.js'
import { SettingsUiItems } from './settings-ui-items.js'
import { SettingsUiGroupHeader } from './settings-ui-group-header.js'

export function SettingsUiGroupItem({ group }: { group: SettingsGroup }) {
  return (
    <div className="py-2">
      <SettingsUiGroupHeader group={group} />
      <SettingsUiItems group={group} items={group.items ?? []} />
    </div>
  )
}
