import type { SettingsPage } from '../data-access/settings-page.js'

export function SettingsUiPageHeaderTitle({ page: { name } }: { page: SettingsPage }) {
  return <span className="text-lg font-bold">{name}</span>
}
