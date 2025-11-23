import { useNetworkLive } from '@workspace/db-react/use-network-live'
import { useSetting } from '@workspace/db-react/use-setting'
import { useMemo } from 'react'

import { SettingsUiNetworkDropdown } from './ui/settings-ui-network-dropdown.tsx'

export function SettingsFeatureNetworkDropdown() {
  const items = useNetworkLive()
  const [activeId, setActiveId] = useSetting('activeNetworkId')
  const activeNetwork = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])
  return <SettingsUiNetworkDropdown activeNetwork={activeNetwork} items={items} setActive={setActiveId} />
}
