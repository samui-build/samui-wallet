import { UiIcon } from '@workspace/ui/components/ui-icon'

import type { SettingsPage } from '../data-access/settings-page.js'

import { SettingsUiPageHeaderTitle } from './settings-ui-page-header-title.js'

export function SettingsUiPageHeader({ page }: { page: SettingsPage }) {
  return (
    <div className="px-2 flex gap-2 items-center">
      <UiIcon icon={page.icon} />
      <SettingsUiPageHeaderTitle page={page} />
    </div>
  )
}
