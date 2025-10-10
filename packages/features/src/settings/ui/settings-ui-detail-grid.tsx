import type { ReactNode } from 'react'

import { useSettings } from '../data-access/settings-provider.js'
import { SettingsUiGroupList } from './settings-ui-group-list.js'

export function SettingsUiDetailGrid({ children }: { children: ReactNode }) {
  const { groups } = useSettings()
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:gap-2 gap-y-2">
      <div>
        <SettingsUiGroupList groups={groups} />
      </div>
      <div className="col-span-2">{children}</div>
    </div>
  )
}
