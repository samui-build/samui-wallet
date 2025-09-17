import { SettingsItem } from '../data-access/settings-item.js'
import { SettingsType } from '../data-access/settings-type.js'

export function SettingsUiInput({ item }: { item: SettingsItem }) {
  switch (item.type) {
    case SettingsType.Boolean:
      return (
        <div>
          <input type="checkbox" />
        </div>
      )
    case SettingsType.Number:
      return (
        <div>
          <input type="number" />
        </div>
      )
    case SettingsType.String:
      return (
        <div>
          <input type="text" />
        </div>
      )
  }
}
