import { useDbPreferenceFindUniqueByKeyLive } from '@workspace/db-react/use-db-preference-find-unique-by-key-live'
import { useDbPreferenceUpdateByKey } from '@workspace/db-react/use-db-preference-update-by-key'
import { useDbWalletLive } from '@workspace/db-react/use-db-wallet-live'
import { useMemo } from 'react'

import { SettingsUiWalletDropdown } from './ui/settings-ui-wallet-dropdown.js'

export function SettingsFeatureWalletDropdown() {
  const items = useDbWalletLive()
  const data = useDbPreferenceFindUniqueByKeyLive({ key: 'activeWalletId' })
  const { mutateAsync } = useDbPreferenceUpdateByKey('activeWalletId')
  const activeWallet = useMemo(() => items.find((c) => c.id === data?.value), [items, data])
  return (
    <SettingsUiWalletDropdown
      activeWallet={activeWallet}
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
