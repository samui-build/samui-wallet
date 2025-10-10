import type { SettingsGroup } from '../data-access/settings-group.js'

import { SettingsUiGroupHeaderIcon } from './settings-ui-group-header-icon.js'
import { SettingsUiGroupHeaderTitle } from './settings-ui-group-header-title.js'

export function SettingsUiGroupHeader({ group }: { group: SettingsGroup }) {
  return (
    <div className="px-2 flex gap-2 items-center">
      <SettingsUiGroupHeaderIcon group={group} />
      <SettingsUiGroupHeaderTitle group={group} />
    </div>
  )
}
