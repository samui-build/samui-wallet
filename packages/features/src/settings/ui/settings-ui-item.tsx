import type { SettingsItem } from '../data-access/settings-item.js'
import { SettingsUiInput } from './settings-ui-input.js'

export function SettingsUiItem({ item }: { item: SettingsItem }) {
  return <SettingsUiInput item={item} />
}
