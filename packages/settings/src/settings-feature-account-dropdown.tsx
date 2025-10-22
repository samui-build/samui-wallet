import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useMemo } from 'react'

import { SettingsUiAccountDropdown } from './ui/settings-ui-account-dropdown.js'

export function SettingsFeatureAccountDropdown() {
  const items = useDbAccountLive()
  const [activeId, setActiveId] = useDbPreference('activeAccountId')
  const activeAccount = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])
  return <SettingsUiAccountDropdown activeAccount={activeAccount} items={items} setActive={setActiveId} />
}
