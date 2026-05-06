import { UiIcon } from '@workspace/ui/components/ui-icon'
import type { SettingsPage } from '../data-access/settings-page.ts'
import { SettingsUiPageHeaderTitle } from './settings-ui-page-header-title.tsx'

export function SettingsUiPageHeader({ page }: { page: SettingsPage }) {
  return (
    <div className="flex items-center gap-2 px-2">
      <UiIcon icon={page.icon} />
      <SettingsUiPageHeaderTitle page={page} />
    </div>
  )
}
