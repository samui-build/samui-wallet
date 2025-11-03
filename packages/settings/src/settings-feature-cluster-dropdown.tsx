import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreference } from '@workspace/db-react/use-db-preference'
import { useMemo } from 'react'

import { SettingsUiClusterDropdown } from './ui/settings-ui-cluster-dropdown.tsx'

export function SettingsFeatureClusterDropdown() {
  const items = useDbClusterLive()
  const [activeId, setActiveId] = useDbPreference('activeClusterId')
  const activeCluster = useMemo(() => items.find((c) => c.id === activeId), [items, activeId])
  return <SettingsUiClusterDropdown activeCluster={activeCluster} items={items} setActive={setActiveId} />
}
