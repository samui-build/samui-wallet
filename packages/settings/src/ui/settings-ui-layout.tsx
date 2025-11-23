import { UiPage } from '@workspace/ui/components/ui-page'
import { Outlet } from 'react-router'
import { useSettingsPages } from '../data-access/use-settings-pages.tsx'
import { SettingsUiPageList } from './settings-ui-page-list.tsx'

export function SettingsUiLayout() {
  const pages = useSettingsPages()

  return (
    <UiPage>
      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 gap-y-2 md:gap-y-4">
        <div>
          <SettingsUiPageList pages={pages} />
        </div>
        <div className="col-span-2">
          <Outlet />
        </div>
      </div>
    </UiPage>
  )
}
