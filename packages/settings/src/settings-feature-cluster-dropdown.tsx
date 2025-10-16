import { useDbClusterLive } from '@workspace/db-react/use-db-cluster-live'
import { useDbPreferenceFindUnique } from '@workspace/db-react/use-db-preference-find-unique-by-key'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'
import { useMemo } from 'react'

import { SettingsUiClusterDropdown } from './ui/settings-ui-cluster-dropdown.js'

export function SettingsFeatureClusterDropdown() {
  const items = useDbClusterLive()
  const { data } = useDbPreferenceFindUnique({ key: 'activeClusterId' })
  const { mutateAsync } = useDbPreferenceUpdateByKey('activeClusterId')
  const activeCluster = useMemo(() => items.find((c) => c.id === data?.value), [items, data])
  return (
    <SettingsUiClusterDropdown
      activeCluster={activeCluster}
      items={items}
      setActive={async (item) => {
        if (!data?.id) {
          return
        }
        await mutateAsync({ input: { value: item.id } })
      }}
    />
  )
}
