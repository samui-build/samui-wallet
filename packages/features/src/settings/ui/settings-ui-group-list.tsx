import { SettingsGroup } from '../data-access/settings-group.js'
import { SettingsUiGroupItem } from './settings-ui-group-item.js'

export function SettingsUiGroupList({ groups }: { groups: SettingsGroup[] }) {
  return (
    <div className="flex flex-col gap-2">
      {groups
        .filter((group) => group.items.length)
        .map((group) => (
          <SettingsUiGroupItem key={group.id} group={group} />
        ))}
    </div>
  )
}
