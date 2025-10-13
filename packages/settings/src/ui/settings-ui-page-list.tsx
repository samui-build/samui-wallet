import type { SettingsPage } from '../data-access/settings-page.js'

import { SettingsUiPageItem } from './settings-ui-page-item.js'

export function SettingsUiPageList({ pages }: { pages: SettingsPage[] }) {
  return (
    <div className="flex flex-col gap-2">
      {pages.map((page) => (
        <SettingsUiPageItem key={page.id} page={page} />
      ))}
    </div>
  )
}
