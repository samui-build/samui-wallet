import { SettingsUiItem } from './settings-ui-item.js'
import type { SettingsGroup } from '../data-access/settings-group.js'

export function SettingsUiItems({ group }: { group: SettingsGroup }) {
  return (
    <div className="py-4 flex flex-col gap-4">
      {group.items.map((item) => (
        <SettingsUiItem key={item.id} item={item} />
      ))}
    </div>
  )
}
