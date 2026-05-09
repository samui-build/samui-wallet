import { UiLayoutListDetail } from '@workspace/ui/components/ui-layout-list-detail'
import { UiSideNav } from '@workspace/ui/components/ui-side-nav'
import { Outlet } from 'react-router'

import { tools } from '../tools.tsx'

export function ToolsUiLayout() {
  return (
    <UiLayoutListDetail basePath="/tools" list={<UiSideNav basePath="/tools" items={tools} />}>
      <Outlet />
    </UiLayoutListDetail>
  )
}
