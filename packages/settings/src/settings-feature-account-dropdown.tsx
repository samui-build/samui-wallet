import { useDbAccountLive } from '@workspace/db-react/use-db-account-live'
import { useDbPreferenceFindUniqueByKeyLive } from '@workspace/db-react/use-db-preference-find-unique-by-key-live'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'
import { useMemo } from 'react'

import { SettingsUiAccountDropdown } from './ui/settings-ui-account-dropdown.js'

export function SettingsFeatureAccountDropdown() {
  const items = useDbAccountLive()
  const data = useDbPreferenceFindUniqueByKeyLive({ key: 'activeAccountId' })
  const { mutateAsync } = useDbPreferenceUpdateByKey('activeAccountId')
  const activeAccount = useMemo(() => items.find((c) => c.id === data?.value), [items, data])
  return (
    <SettingsUiAccountDropdown
      activeAccount={activeAccount}
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
