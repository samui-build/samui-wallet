import { useDbNetworkLive } from '@workspace/db-react/use-db-network-live'
import { useDbSetting } from '@workspace/db-react/use-db-setting'
import { useMemo } from 'react'

import { SettingsUiNetworkDropdown } from './ui/settings-ui-network-dropdown.tsx'

export function SettingsFeatureNetworkDropdown() {
  const items = useDbNetworkLive()
  const [activeId, setActiveId] = useDbSetting('activeNetworkId')
  const activeNetwork = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])
  return <SettingsUiNetworkDropdown activeNetwork={activeNetwork} items={items} setActive={setActiveId} />
}
