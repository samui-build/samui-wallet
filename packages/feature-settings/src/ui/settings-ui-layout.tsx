import { UiLayoutListDetail } from '@workspace/ui/components/ui-layout-list-detail'
import { UiSideNav } from '@workspace/ui/components/ui-side-nav'
import { Outlet } from 'react-router'

import { useSettingsPages } from '../data-access/use-settings-pages.tsx'

export function SettingsUiLayout() {
  const pages = useSettingsPages()

  return (
    <UiLayoutListDetail
      basePath="/settings"
      list={
        <UiSideNav
          basePath="/settings"
          items={pages.map((page) => ({
            description: page.description,
            icon: page.icon,
            label: page.name,
            path: page.id,
          }))}
        />
      }
    >
      <Outlet />
    </UiLayoutListDetail>
  )
}
