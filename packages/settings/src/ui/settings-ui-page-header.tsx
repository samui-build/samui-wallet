import type { SettingsPage } from '../data-access/settings-page.js'

import { SettingsUiPageHeaderIcon } from './settings-ui-page-header-icon.js'
import { SettingsUiPageHeaderTitle } from './settings-ui-page-header-title.js'

export function SettingsUiPageHeader({ page }: { page: SettingsPage }) {
  return (
    <div className="px-2 flex gap-2 items-center">
      <SettingsUiPageHeaderIcon page={page} />
      <SettingsUiPageHeaderTitle page={page} />
    </div>
  )
}
