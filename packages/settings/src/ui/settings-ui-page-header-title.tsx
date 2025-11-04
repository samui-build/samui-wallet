import type { SettingsPage } from '../data-access/settings-page.ts'

export function SettingsUiPageHeaderTitle({ page: { name } }: { page: SettingsPage }) {
  return <span className="text-lg font-bold">{name}</span>
}
