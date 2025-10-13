import { Outlet } from 'react-router'

import { useSettingsPages } from '../data-access/use-settings-pages.js'
import { SettingsUiPageList } from './settings-ui-page-list.js'

export function SettingsUiLayout() {
  const pages = useSettingsPages()

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-2 gap-y-2">
      <div>
        <SettingsUiPageList pages={pages} />
      </div>
      <div className="col-span-2">
        <Outlet />
      </div>
    </div>
  )
}
