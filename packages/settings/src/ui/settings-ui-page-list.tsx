import type { SettingsPage } from '../data-access/settings-page.ts'

import { SettingsUiPageItem } from './settings-ui-page-item.tsx'

export function SettingsUiPageList({ pages }: { pages: SettingsPage[] }) {
  return (
    <div className="flex flex-col gap-1 sm:gap-2 md:gap-4">
      {pages.map((page) => (
        <SettingsUiPageItem key={page.id} page={page} />
      ))}
    </div>
  )
}
