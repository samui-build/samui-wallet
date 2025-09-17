import { SettingsItem } from '../data-access/settings-item.js'
import { SettingsUiItem } from './settings-ui-item.js'
import { SettingsGroup } from '../data-access/settings-group.js'

export function SettingsUiItems({ group, items }: { group: SettingsGroup; items: SettingsItem[] }) {
  return (
    <div className="py-4 flex flex-col gap-4">
      {items.map((item) => (
        <SettingsUiItem key={item.id} group={group} item={item} />
      ))}
    </div>
  )
}
