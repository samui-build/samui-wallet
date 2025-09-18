import { SettingsItem } from '../data-access/settings-item.js'
import { SettingsGroup } from '../data-access/settings-group.js'
import { SettingsUiInput } from './settings-ui-input.js'

export function SettingsUiItem({ group, item }: { group: SettingsGroup; item: SettingsItem }) {
  return <SettingsUiInput item={item} />
}
