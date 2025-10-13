import type { SettingsPage } from '../data-access/settings-page.js'

export function SettingsUiPageHeaderIcon({ page: { icon: Icon } }: { page: SettingsPage }) {
  return <Icon className="h-6 w-6" />
}
